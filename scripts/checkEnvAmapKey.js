const path = require('path');
const fs = require('fs');
const {Buffer} = require('buffer');
const argv = process.argv.slice(2);
const rootDir = process.cwd();
const fsPromise = fs.promises;
const chalk = require('chalk');
// const shell = require('shelljs');

console.log('argv:', argv); // [ '.env.development', '.env.amapkey' ]

const envAmapKeyFilePath = path.resolve(rootDir, `./${argv[0]}`);
const envAmapKeyFileTemplate = `
# 高德地图key
# android
AMP_ANDROID_API_KEY=请输入您的android api key
# web服务 js api key
AMP_JS_API_KEY=请输入您的web服务 js api key
# web服务 js api secret key
AMP_JS_API_SECRET_KEY=请输入您的web服务 js api secret key
`;

const handleWrite = async () => {
  try {
    // https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromiseswritefilefile-data-options
    const controller = new AbortController();
    const {signal} = controller;
    const data = new Uint8Array(Buffer.from(envAmapKeyFileTemplate));

    const promise = await fsPromise.writeFile(envAmapKeyFilePath, data, {
      signal,
      encoding: 'utf8',
      flags: 'w', // 以写入模式打开文件，如果文件不存在则创建
    });

    // Abort the request before the promise settles.
    controller.abort();

    await promise;
  } catch (error) {
    console.log(chalk.red('写入文件失败'), error);
  } finally {
    process.exit(1);
  }
};

async function writeEnvAmapKeyFile() {
  // https://nodejs.org/docs/latest-v16.x/api/fs.html#fsexistspath-callback
  fs.open(envAmapKeyFilePath, 'wx', async (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        console.log(`${envAmapKeyFilePath}文件已存在`);
      }
      process.exit(1);
      return;
    }

    try {
      await handleWrite();
    } finally {
      fs.close(fd, error => {
        if (error) {
          throw error;
        }
      });
      process.exit(1);
    }
  });
}

// 检查本地根目录是否存在`.env.amapkey`文件
async function checkEnvAmapKeyFile() {
  try {
    await fsPromise.stat(envAmapKeyFilePath);
    console.log(`${chalk.green('项目根目录已存在 `.env.amapkey` 文件')};`);
  } catch (error) {
    console.log(`
      ${chalk.red.bgYellow('项目根目录不存在 `.env.amapkey` 文件，将进行创建')};
      ${chalk.yellow(
        '请在生成的`.env.amapkey`文件中填入高德地图API KEY，未申请的请前往高德地图 https://console.amap.com/dev/key/app 中申请创建，申请成功后，请复制key到 `.env.amapkey`文件相应位置，然后重新启动项目',
      )}
    `);

    // shell.exec('touch \\.env.amapkey');
    await writeEnvAmapKeyFile();
  }
}

checkEnvAmapKeyFile();
