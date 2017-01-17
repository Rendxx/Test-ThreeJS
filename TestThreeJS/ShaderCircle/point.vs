attribute float radius;
varying vec4 v_color;
varying float rad;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = radius*4.0+2.0;
	rad = gl_PointSize/2.0;
    v_color = vec4(0.6, 0.3, 0.0, 1.0);
}
