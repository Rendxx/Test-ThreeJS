varying vec4 v_color;

void main() {
    float dis = length(gl_PointCoord*2.0-1.0);
    if(dis > 1.0){
        discard;
    }

	gl_FragColor = v_color;
}