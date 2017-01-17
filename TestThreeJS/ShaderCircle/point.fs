varying vec4 v_color;
varying float rad;

void main() {
    float dis = length(gl_PointCoord*2.0-1.0);
	float t = 0.0;
    if(dis > 1.0){
        discard;
    }else {
		float d =dis*rad - rad+1.0;
		t = clamp(d, 0.0, 1.0);
	}

	gl_FragColor = vec4(v_color.rgb, 1.0-t);
}