node src/server/index.mjs

cd some/location/where/images/are
draw5 % ffmpeg -framerate 50 -i %002d.png -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le -vf  "tblend=all_mode=average,gblur=sigma=1" output.mov
