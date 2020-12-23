const electronInstaller = require('electron-winstaller');

async function createInstaller() {
try {
    await electronInstaller.createWindowsInstaller({
      appDirectory: './build/target/KovaaksPlaylistManager-win32-x64',
      outputDirectory: './build/target/installer',
      loadingGif: './build/assets/installing.gif',
      authors: 'sens',
      exe: 'KovaaksPlaylistManager.exe',
    });
    console.log('It worked!');
  } catch (e) {
    console.log(`No dice: ${e.message}`);
  }
}

createInstaller()