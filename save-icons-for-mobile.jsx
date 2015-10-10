//アイコンサイズ定義 (Android用）
//ファイル名：アイコンサイズ
var ANDROID_ICON_SIZE = {
  "MDPI": 48,
  "HDPI": 72,
  "XHDPI": 96,
  "XXHDPI": 144,
  "XXXHDPI": 192
}

//アイコンサイズ定義 (iOS用）
//ファイル名：アイコンサイズ
var IOS_ICON_SIZE = {
  "icon": 57,
  "icon@2x": 114,
  "icon-small": 29,
  "icon-small@2x": 58,
  "icon-small-50": 50,
  "icon-small-50@2x": 100,
  "icon-72": 72,
  "icon-72@2x": 144,
  "iTunesArtwork": 512,
  "iTunesArtwork@2x": 1024
}

//実行
main();

function main() {

  if (!isIllustartor()) {
    alert("このスクリプトは Adobe Illustrator でのみ実行可能です。");
    return;
  }

  if (!hasDocuments()) {
    alert("ドキュメントが開かれていません。");
    return;
  }

  if (!hasSelection()) {
    alert("アイコンとして保存するオブジェクトを選択してから実行してください。");
    return;
  }

  var folder = Folder.selectDialog("保存フォルダを選択してください。");
  if (!folder) {
    return;
  }

  //保存用アートーボードを作成
  var artboardIndex = createArtboardWithSelectionSize();

  //各サイズに変換して保存
  saveIcons(folder);

  //保存用アートボードを削除
  app.activeDocument.artboards[artboardIndex].remove();

  alert("保存完了しました。");
}

//Adobe Illustratorを実行しているかどうかを判定
function isIllustartor() {
  return app.name == "Adobe Illustrator";
}

//文書を開いているかを判定
function hasDocuments() {
  return documents.length > 0;
}

//オブジェクトが選択されているかを判定
function hasSelection() {
  return app.activeDocument.selection.length > 0;
}

//選択アイテムと同じサイズのアートボードを作成
function createArtboardWithSelectionSize() {
  var doc = app.activeDocument;
  var artboard = doc.artboards.add([0, 0, 10, -10]);
  artboard.name = "アイコン保存用";
  var artboardIndex = getArdboardIndex(artboard);
  doc.fitArtboardToSelectedArt(artboardIndex);
  doc.artboards.setActiveArtboardIndex(artboardIndex);
  return artboardIndex;
}

//アートボードのIndexを取得
function getArdboardIndex(artboard) {
  var doc = app.activeDocument;
  var n = doc.artboards.length;
  for (var i = 0; i < n; i++) {
    if (doc.artboards[i] == artboard) {
      return i;
    }
  }
}

//アクティブなアートボードの横幅を取得
function getActiveArtboardWidth() {
  var doc = app.activeDocument;
  var activeArtboardIndex = doc.artboards.getActiveArtboardIndex();
  var rect = doc.artboards[activeArtboardIndex].artboardRect;
  var left = rect[0];
  var right = rect[2];

  return right - left;
}

//アクティブなアートボードの高さを取得
function getActiveArtboardHeight() {
  var doc = app.activeDocument;
  var activeArtboardIndex = doc.artboards.getActiveArtboardIndex();
  var rect = doc.artboards[activeArtboardIndex].artboardRect;
  var top = rect[1];
  var bottom = rect[3];

  return -(bottom - top);
}


//指定フォルダに選択アイテムをサイズ変換して保存
function saveIcons(folder) {

  var artboardWidth = getActiveArtboardWidth();
  var artboardHeight = getActiveArtboardHeight();
  var baseFolder = folder + "/ICON";
  var androidFolder = baseFolder + "/ANDROID";
  var iosFolder = baseFolder + "/IOS";

  Folder(baseFolder).create();

  //android
  Folder(androidFolder).create();
  for (var name in ANDROID_ICON_SIZE) {

    var filePath = androidFolder + "/" + name + ".png";
    var size = ANDROID_ICON_SIZE[name];

    var scaleX = size / artboardWidth * 100.0;
    var scaleY = size / artboardHeight * 100.0;

    savePNG24(filePath, scaleX, scaleY);
  }

  //iOS
  Folder(iosFolder).create();
  for (var name in IOS_ICON_SIZE) {

    var filePath = iosFolder + "/" + name + ".png";
    var size = IOS_ICON_SIZE[name];

    var scaleX = size / artboardWidth * 100.0;
    var scaleY = size / artboardHeight * 100.0;

    savePNG24(filePath, scaleX, scaleY);
  }

}

//PNG24
function savePNG24(filePath, scaleX, scaleY) {

  var opt = new ExportOptionsPNG24();
  opt.transparency = true;
  opt.antiAliasing = true;
  opt.artBoardClipping = true;
  opt.horizontalScale = scaleX;
  opt.verticalScale = scaleY;

  app.activeDocument.exportFile(File(filePath), ExportType.PNG24, opt);
}
