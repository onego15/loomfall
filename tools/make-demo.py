"""Encode captured browser screenshots into the README GIF and a silent MP4."""
from pathlib import Path
from PIL import Image
import json, subprocess
import imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
meta=json.loads((root/'docs/recording.json').read_text(encoding='utf-8'))
frames=[];durations=[]
gif_frames=[f for f in meta['frames'] if f['at']<12500]
for i,f in enumerate(gif_frames):
    im=Image.open(root/f"tmp/capture/{i:04d}.jpg").convert('RGB')
    im.thumbnail((900,600),Image.Resampling.LANCZOS)
    frames.append(im.quantize(colors=112,method=Image.Quantize.MEDIANCUT))
    following=gif_frames[i+1]['at'] if i+1<len(gif_frames) else 12500
    durations.append(max(20,round((following-f['at'])/10)*10))
frames[0].save(root/'docs/demo.gif',save_all=True,append_images=frames[1:],duration=durations,loop=0,optimize=False,disposal=2)
concat=root/'tmp/capture/frames.txt'
lines=[]
for i,f in enumerate(meta['frames']):
    file=(root/f"tmp/capture/{i:04d}.jpg").as_posix()
    following=meta['frames'][i+1]['at'] if i+1<len(meta['frames']) else 32000
    lines.extend([f"file '{file}'",f"duration {max(.02,(following-f['at'])/1000):.5f}"])
lines.append(f"file '{file}'")
concat.write_text('\n'.join(lines),encoding='utf-8')
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','concat','-safe','0','-i',str(concat),'-vsync','vfr','-c:v','libx264','-pix_fmt','yuv420p','-crf','23','-movflags','+faststart',str(root/'docs/gameplay.mp4')],check=True,capture_output=True)
print({'frames':len(frames),'gif_seconds':sum(durations)/1000,'gif_bytes':(root/'docs/demo.gif').stat().st_size,'mp4_bytes':(root/'docs/gameplay.mp4').stat().st_size})
