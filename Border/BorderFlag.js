
//--  Draw Backing   ------------------------------------------

export function draw_flag_backing(easel, wid, hei, size, colors, counter){
    let use_wid = size * 5;

    easel.rotate((45 * Math.PI) / 180);

    let lesser = wid < hei ? wid : hei;
    let time_on_screen = Math.sqrt(Math.pow(lesser, 2) * 2) + use_wid;

    let cap_add = Math.floor(time_on_screen / use_wid) + 1;

    time_on_screen = cap_add * use_wid;

    let cap = Math.floor(wid < hei ? hei / use_wid : wid / use_wid) + 1;

    //cap = cap * 2;

    let num_bars = Math.floor((cap + cap_add) / colors.length) + 2;
    num_bars *= colors.length;
    

    for(let i = 0; i < num_bars; i++){
        easel.fillStyle = colors[i % colors.length];
        let x = i * use_wid + ((counter) % (colors.length * use_wid)) - time_on_screen * 3 / 2;
        let y = -x - use_wid;
        easel.fillRect(x, y, use_wid, hei + use_wid * 2 + i * use_wid);
    }


    easel.setTransform(1, 0, 0, 1, 0, 0);
}
