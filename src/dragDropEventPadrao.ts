import { QDropEvent, QProgressDialog } from "@nodegui/nodegui";
import { NativeRawPointer } from "@nodegui/nodegui/dist/lib/core/Component";
import * as path from 'path';
import * as child_process from 'child_process';
import * as fs from 'fs';

export function dragDropEventPadrao(event: NativeRawPointer<"QEvent"> | undefined, ffmpeg_args: string, caminho_ffpmeg: string) {
    if (event) {
        try {
            fs.unlinkSync(path.resolve('./output.mp4'));
        } catch (error) {}
        let urls = new QDropEvent(event).mimeData().urls();
        for (let u of urls) {
            console.log(path.normalize(u.toString().replace('file:///','')));
            const file_path = u.toString(),
                convert_args = ffmpeg_args.replace('[CAMINHO_ARQUIVO]',path.normalize(file_path.replace('file:///',''))).split(' '),
                probe_args = `-v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 ${path.normalize(file_path.replace('file:///',''))}`.split(' '),
                total_frames = parseInt(child_process.spawnSync(`${caminho_ffpmeg}ffprobe.exe`,probe_args).stdout.toString()),
                progressBar = new QProgressDialog(),
                ffmpeg_process = child_process.spawn(`${caminho_ffpmeg}ffmpeg.exe`,convert_args);

            ffmpeg_process.stderr.on('data', function(data) {
                //1: Separa todas as novas linhas (\n)
                //2: Cria um array de pares com as propriedades antes e depois do "="
                //3: Cria um objeto usando os pares criados anteriormente
                let output = Object.assign({},...data.toString().split('\n').map((param: string) => Object.fromEntries([param.split('=')]))),
                    percentage_done = ((100 * output.frame) / total_frames);
                
                progressBar.setValue(percentage_done);
                if(progressBar.wasCanceled()) { progressBar.close(); ffmpeg_process.kill(); };
            });
        }
    }
}