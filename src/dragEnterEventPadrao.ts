import { QDragMoveEvent } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";

export function dragEnterEventPadrao(event: NativeRawPointer<"QEvent"> | undefined) {
    if (event) {
        let ev = new QDragMoveEvent(event);
        let mimeData = ev.mimeData();
        for (let url of mimeData.urls()) {
            let str = url.toString();
            //Se não é MP4, não aceita
            if(str.substr(str.length - 3) !== 'mp4') return;
        }
        ev.accept();
      }
}