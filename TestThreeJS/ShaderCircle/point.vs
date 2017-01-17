varying vec4 v_color;
void main() {
    float radius = 10.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_PointSize = (radius*projectionMatrix[1][1]/gl_Position.w)*2.0;
    v_color = vec4(0.0, 0.5, 0.5, 1.0);
}
