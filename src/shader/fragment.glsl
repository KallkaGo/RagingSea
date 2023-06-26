uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMutiplier;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
varying float vElevation;

void main(){
    float strength =( vElevation+uColorOffset)*uColorMutiplier;
    vec3 mixColor  = mix(uDepthColor,uSurfaceColor,strength);
    gl_FragColor = vec4(mixColor,1.0);
    //#ifdef USE_FOG 是一个预处理指令，在着色器代码中用于检查是否定义了 USE_FOG 这个宏，可以在material中的fog开启或关闭
     #ifdef USE_FOG
    //  gl_FragCoord.z / gl_FragCoord.w就表示当前片元和camera之间的距离即深度
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
    #endif
}