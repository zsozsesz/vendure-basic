import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  DefaultAssetNamingStrategy,
} from '@vendure/core';
import {
  defaultEmailHandlers,
  EmailPlugin,
  FileBasedTemplateLoader,
} from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import 'dotenv/config';
import path from 'path';
import { configureS3AssetStorage } from './plugins/asset/s3-asset-storage-strategy';

const IS_DEV = process.env.APP_ENV === 'dev';
const serverPort = +process.env.PORT || 3000;

console.log(process.env);

const assetServerPlugin =
  process.env.USE_S3_ASSET_SERVER === 'true'
    ? AssetServerPlugin.init({
        route: 'assets',
        assetUploadDir: './static/assets',
        assetUrlPrefix: `${process.env.CDN_URL}/`,
        namingStrategy: new DefaultAssetNamingStrategy(),
        storageStrategyFactory: configureS3AssetStorage({
          bucket: process.env.SPACES_BUCKET,
          credentials: {
            accessKeyId: process.env.SPACES_KEY,
            secretAccessKey: process.env.SPACES_SECRET,
          },
          nativeS3Configuration: {
            endpoint: `${process.env.SPACES_ENDPOINT}`,
            region: 'us-east-1',
            forcePathStyle: false,
          },
          nativeS3UploadConfiguration: {
            ACL: 'public-read',
          },
        }),
      })
    : AssetServerPlugin.init({
        route: 'assets',
        assetUploadDir: path.join(__dirname, '../static/assets'),
        // For local dev, the correct value for assetUrlPrefix should
        // be guessed correctly, but for production it will usually need
        // to be set manually to match your production url.
        // assetUrlPrefix: `${process.env.APP_URL}/assets/`,
      });

export const config: VendureConfig = {
  apiOptions: {
    port: serverPort,
    adminApiPath: 'admin-api',
    shopApiPath: 'shop-api',
    // The following options are useful in development mode,
    // but are best turned off for production for security
    // reasons.
    ...(IS_DEV
      ? {
          adminApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          adminApiDebug: true,
          shopApiPlayground: {
            settings: { 'request.credentials': 'include' },
          },
          shopApiDebug: true,
        }
      : {}),
  },
  authOptions: {
    tokenMethod: ['bearer', 'cookie'],
    superadminCredentials: {
      identifier: process.env.SUPERADMIN_USERNAME,
      password: process.env.SUPERADMIN_PASSWORD,
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET,
    },
  },
  dbConnectionOptions:
    process.env.PG_ENABLED === 'true'
      ? {
          type: 'postgres',
          // See the README.md "Migrations" section for an explanation of
          // the `synchronize` and `migrations` options.
          synchronize: true,
          migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
          logging: false,
          database: process.env.POSTGRES_DB,
          host: process.env.POSTGRES_HOST,
          port: +process.env.POSTGRES_PORT,
          username: process.env.POSTGRES_USER,
          password: process.env.POSTGRES_PASSWORD,
          schema: process.env.POSTGRES_SCHEMA,
          ssl: {
            rejectUnauthorized: true,
            ca: process.env.POSTGRES_CERT,
          },
        }
      : {
          type: 'better-sqlite3',
          // See the README.md "Migrations" section for an explanation of
          // the `synchronize` and `migrations` options.
          synchronize: false,
          migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
          logging: false,
          database: path.join(__dirname, '../vendure.sqlite'),
        },
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler],
  },
  // When adding or altering custom field definitions, the database will
  // need to be updated. See the "Migrations" section in README.md.
  customFields: {},
  plugins: [
    assetServerPlugin,
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),
    EmailPlugin.init({
      devMode: true,
      outputPath: path.join(__dirname, '../static/email/test-emails'),
      route: 'mailbox',
      handlers: defaultEmailHandlers,
      templateLoader: new FileBasedTemplateLoader(
        path.join(__dirname, '../static/email/templates')
      ),
      globalTemplateVars: {
        // The following variables will change depending on your storefront implementation.
        // Here we are assuming a storefront running at http://localhost:8080.
        fromAddress: '"example" <noreply@example.com>',
        verifyEmailAddressUrl: 'http://localhost:8080/verify',
        passwordResetUrl: 'http://localhost:8080/password-reset',
        changeEmailAddressUrl:
          'http://localhost:8080/verify-email-address-change',
      },
    }),
    AdminUiPlugin.init({
      route: 'admin',
      port: serverPort + 2,
      adminUiConfig: {
        apiPort: 'auto',
      },
    }),
  ],
};
