import { QMainWindow, QWidget, QLabel, FlexLayout, QPixmap, AspectRatioMode, WidgetEventTypes, QDropEvent, QDragMoveEvent, QProgressDialog } from '@nodegui/nodegui';
import wa_logo from '../assets/wa_logo.png';
import twitter_logo from '../assets/twitter_logo.png';
import { dragEnterEventPadrao } from './dragEnterEventPadrao';
import { dragDropEventPadrao } from './dragDropEventPadrao';

const CAMINHO_FFMPEG = 'C:\\Program Files (x86)\\ffmpeg\\bin\\';

const win = new QMainWindow();
win.setFixedSize(586, 290);
win.setWindowTitle("Convert");

const centralBox = new QWidget();
centralBox.setObjectName("centralBox");
centralBox.setStyleSheet(`
#centralBox {
  background-color: #0d1418;
  flex: 1;
  height: '100%';
  width: '100%';
  align-items: 'center';
  justify-content: 'center';
}`);
const rootLayout = new FlexLayout();
centralBox.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("instructionLabel");
label.setText("Arraste um clipe em um determinado ícone para converte-lo para o formato aceito");
label.setStyleSheet(`
    #instructionLabel {
        color: white;
        font-size: 14px;
        font-weight: bold;
        padding: 5;
    }
`);

const wa_label = new QLabel();
wa_label.setPixmap(new QPixmap(wa_logo).scaled(220, 200, AspectRatioMode.KeepAspectRatio));
wa_label.setAcceptDrops(true);
wa_label.addEventListener(WidgetEventTypes.DragEnter, dragEnterEventPadrao);
wa_label.addEventListener(WidgetEventTypes.Drop, (event) => {
    //[CAMINHO_ARQUIVO] é onde será substituido pelo caminho do arquivo na função do evento
    dragDropEventPadrao(event,'-hide_banner -v warning -progress pipe:2 -i [CAMINHO_ARQUIVO] -vcodec libx264 -acodec aac output.mp4', CAMINHO_FFMPEG);
});

const twitter_label = new QLabel();
twitter_label.setPixmap(new QPixmap(twitter_logo).scaled(220, 200, AspectRatioMode.KeepAspectRatio));
twitter_label.setAcceptDrops(true);
twitter_label.addEventListener(WidgetEventTypes.DragEnter, dragEnterEventPadrao);
twitter_label.addEventListener(WidgetEventTypes.Drop, (event) => {
  dragDropEventPadrao(event,'-hide_banner -v warning -progress pipe:2 -i [CAMINHO_ARQUIVO] -c:v libx264 -crf 18 -vf crop=iw:ih-1 -c:a copy output.mp4', CAMINHO_FFMPEG);
});


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

win.show();

(global as any).win = win;