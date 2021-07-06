import { QMainWindow, QWidget, QLabel, FlexLayout, QPixmap, AspectRatioMode, WidgetEventTypes, QDropEvent, QDragMoveEvent } from '@nodegui/nodegui';
import wa_logo from '../assets/wa_logo.png';
import twitter_logo from '../assets/twitter_logo.png';
import * as path from 'path';
import * as child_process from 'child_process';

const win = new QMainWindow();
win.setFixedSize(566, 290);
win.setWindowTitle("Convert");

const centralBox = new QWidget();
centralBox.setObjectName("centralBox");
const rootLayout = new FlexLayout();
centralBox.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("instructionLabel");
label.setText("Drag a clip into one of the icons to convert to the format accepted by the app!");
label.setStyleSheet(`
  #instructionLabel {
    color: white;
    font-size: 14px;
    font-weight: bold;
    padding: 5;
  }
`);

const wa_label = new QLabel();
const wa_path = wa_logo;
const wa_img = new QPixmap();
wa_img.load(wa_path);
wa_label.setPixmap(wa_img.scaled(220, 200, AspectRatioMode.KeepAspectRatio));
wa_label.resize(220, 200);
wa_label.setAcceptDrops(true);

wa_label.setAcceptDrops(true);

wa_label.addEventListener(WidgetEventTypes.DragEnter, (e) => {
  if (e) {
    let ev = new QDragMoveEvent(e);
    let mimeData = ev.mimeData();
    for (let url of mimeData.urls()) {
        let str = url.toString();
        //If its not mp4, don't accept
        if(str.substr(str.length - 3) !== 'mp4') return;
    }
    ev.accept(); //Accept the drop event, which is crucial for accepting further events
  }
});
wa_label.addEventListener(WidgetEventTypes.Drop, (e) => {
  if (e) {
    let dropEvent = new QDropEvent(e);
    let mimeData = dropEvent.mimeData();
    console.log('dropped', dropEvent.type());
    let urls = mimeData.urls();
    for (let u of urls) {
      let str = u.toString();
      let args = [
        '-hide_banner',
        '-v',
        'warning',
        '-progress',
        'pipe:2',
        '-i',
        `${path.normalize(str.replace('file:///',''))}`,
        '-vcodec',
        'libx264',
        '-acodec',
        'aac',
        'output.mp4'
      ]
      child_process.spawn("C:\\Program Files (x86)\\ffmpeg\\bin\\ffmpeg.exe",args).stderr.pipe(process.stdout);
      //child_process.exec(`"C:\\Program Files (x86)\\ffmpeg\\bin\\ffmpeg.exe" -i "${str.replace('file:///','')}" -vcodec libx264 -acodec aac output.mp4`).stdout?.pipe(process.stdout);
    }
  }
});

const twitter_label = new QLabel();
twitter_label.setAcceptDrops(true);
const twitter_path = twitter_logo;
const twitter_img = new QPixmap();
twitter_img.load(twitter_path);
twitter_label.setPixmap(twitter_img.scaled(220, 200, AspectRatioMode.KeepAspectRatio));


const row0 = new QWidget();
row0.setStyleSheet('#row0 { padding: 35px; flex-direction: row; }');
row0.setObjectName("row0");
const row0Layout = new FlexLayout();
row0.setLayout(row0Layout);
row0Layout.addWidget(wa_label);
row0Layout.addWidget(twitter_label);

rootLayout.addWidget(label);
rootLayout.addWidget(row0);
win.setCentralWidget(centralBox);
win.setStyleSheet(`
    #centralBox {
      background-color: #0d1418;
      flex: 1;
      height: '100%';
      width: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
`);

win.show();

(global as any).win = win;