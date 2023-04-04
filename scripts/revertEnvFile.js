const path = require('path');
const fs = require('fs');
const {Buffer} = require('buffer');
const argv = process.argv.slice(2);
const rootDir = process.cwd();
const fsPromise = fs.promises;
const chalk = require('chalk');

console.log('argv:', argv); // [ '.env.development', '.env.local' ]

const envLocalFilePath = path.resolve(rootDir, `./${argv[1]}`);
const envFilePath = path.resolve(rootDir, `./${argv[0]}`);

const handleWrite = async (filePath, data) => {
  try {
    // https://nodejs.org/docs/latest-v16.x/api/fs.html#fspromiseswritefilefile-data-options
    const controller = new AbortController();
    const {signal} = controller;
    const str = new Uint8Array(Buffer.from(data));
    const promise = await fsPromise.writeFile(filePath, str, {
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

async function writeEnvAmapKeyFile(filePath, data) {
  // https://nodejs.org/docs/latest-v16.x/api/fs.html#fsexistspath-callback
  fs.open(filePath, 'wx', async (err, fd) => {
    if (err) {
      if (err.code === 'EEXIST') {
        await handleWrite(filePath, data);
      }
      process.exit(1);
      return;
    }

    try {
      await handleWrite(filePath, data);
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

// 读取文件内容
async function handleReadFile(fileName) {
  try {
    const promise = fsPromise.readFile(fileName, {encoding: 'utf8'});

    return await promise;
  } catch (err) {
    // When a request is aborted - err is an AbortError
    console.error(err);
    return '';
  }

  // fs.readFile(
  //   fileName,
  //   {
  //     encoding: 'utf8',
  //   },
  //   (err, data) => {
  //     if (err) {
  //       console.log(err);
  //       return;
  //     }

  //     console.log(data);
  //   },
  // );
}

// 检查本地根目录是否存在`.env.local`文件
async function handleRevertEnvFile() {
  try {
    await fsPromise.stat(envLocalFilePath);

    const envAmapFileContent = await handleReadFile(envLocalFilePath);
    const envFileContent = await handleReadFile(envFilePath);

    if (envAmapFileContent === '') {
      return;
    }

    const replaceStr = envFileContent.replace(envAmapFileContent, '');

    await writeEnvAmapKeyFile(envFilePath, replaceStr);
  } catch (error) {
    console.log(error);
    console.log(
      `${chalk.red.bgYellow(
        '请检查 `.env.[development|production]` 文件，若有新增加的高德地图 API KEY，请撤回更改，勿提交到远程仓库',
      )}`,
    );
  }
}

handleRevertEnvFile();
