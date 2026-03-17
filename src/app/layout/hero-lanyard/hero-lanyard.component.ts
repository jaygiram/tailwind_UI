import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
 } from '@angular/core'
 
 import * as THREE from 'three'
 
 @Component({
  selector:'app-hero-lanyard',
  standalone:true,
  templateUrl:'./hero-lanyard.component.html',
  styleUrls:['./hero-lanyard.component.css']
 })
 export class HeroLanyardComponent implements AfterViewInit{
 
 @ViewChild('canvasContainer') container!:ElementRef
 
 scene!:THREE.Scene
 camera!:THREE.PerspectiveCamera
 renderer!:THREE.WebGLRenderer
 
 card!: THREE.Mesh
 cardGroup!: THREE.Group
 ropeLine!: THREE.Mesh<THREE.TubeGeometry,THREE.MeshStandardMaterial>
 points:any[]=[]
 segments=12
 segmentLength=0.25
 
 isDragging=false
 mouseX=0
 mouseY=0
 cardVelocity = 0
 cardAnchorX=0
 cardAnchorY=0
 
 smoothedRopeX=0
 smoothedRopeY=0
 
 cardAngle=0
 cardTargetAngle=0
 
 clock=new THREE.Clock()
 
 ngAfterViewInit(){
  this.initThree()
  this.initRope()
  this.animate()
 }
 
 initThree(){
 
  const width=this.container.nativeElement.clientWidth
  const height=this.container.nativeElement.clientHeight
 
  this.scene=new THREE.Scene()
  this.scene.position.y = 0
 
  this.camera=new THREE.PerspectiveCamera(
  40,width/height,0.1,100
  )
 
  this.camera.position.y = -1
  this.camera.position.z=8
 
  this.renderer=new THREE.WebGLRenderer({
   alpha:true,
   antialias:true
  })
 
  this.renderer.setSize(width, height, false)
 
  this.container.nativeElement.appendChild(
   this.renderer.domElement
  )
 
  const light=new THREE.DirectionalLight(0xffffff,1)
  light.position.set(3,3,5)
 
  const ambient=new THREE.AmbientLight(0xffffff,0.7)
 
  this.scene.add(light)
  this.scene.add(ambient)
 
  /* CARD */
 
  const cardGeo=new THREE.BoxGeometry(2.4,3.4,0.12)
 
  const texture=new THREE.TextureLoader().load(
    'assets/lanyard/card.png'
   )
   
   texture.colorSpace = THREE.SRGBColorSpace
   texture.anisotropy = 16
   texture.generateMipmaps = true
   texture.minFilter = THREE.LinearMipmapLinearFilter
 
   const cardMat=new THREE.MeshStandardMaterial({
    map:texture,
    roughness:0.5,
    metalness:0.1,
    transparent:true
   })
 
  this.card=new THREE.Mesh(cardGeo,cardMat)

  this.cardGroup = new THREE.Group()

  this.cardGroup.add(this.card)
  
  // move card DOWN inside group so top becomes pivot
  this.card.position.y = -1.4  // (half height ~ 3.4 / 2 ≈ 1.7, adjusted visually)
  
  this.scene.add(this.cardGroup)
 
  /* GLARE */
 
  const glareGeo=new THREE.PlaneGeometry(2.2,3.2)
 
  const glareMat=new THREE.MeshBasicMaterial({
   color:0xffffff,
   transparent:true,
   opacity:0.15,
   blending:THREE.AdditiveBlending
  })
 
  const glare=new THREE.Mesh(glareGeo,glareMat)
 
  glare.position.z=0.07
 
  this.card.add(glare)
 
  /* SHADOW */
 
  // const shadowGeo=new THREE.PlaneGeometry(2.6,0.6)
 
  // const shadowMat=new THREE.MeshBasicMaterial({
  //  color:0x000000,
  //  transparent:true,
  //  opacity:0.25
  // })
 
  // const shadow=new THREE.Mesh(shadowGeo,shadowMat)
 
  // shadow.position.set(0,-2.4,-0.1)
  // shadow.rotation.x=-Math.PI/2
 
  // this.scene.add(shadow)
  
 
 }
 
 initRope(){
 
  this.points=[]
 
  for(let i=0;i<=this.segments;i++){
 
    const y = 2. - (i * this.segmentLength)
 
   this.points.push({
    x:0,
    y:y,
    oldx:0,
    oldy:y
   })
 
  }
 
  const ropePoints=this.points.map(
  p=>new THREE.Vector3(p.x,p.y,0)
  )
 
  const curve = new THREE.CatmullRomCurve3(ropePoints, false, "catmullrom", 0.5)
 
  const tubeGeo=new THREE.TubeGeometry(
  curve,
  40,
  0.02,
  8,
  false
  )
 
  const tubeMat=new THREE.MeshStandardMaterial({
   color:0xffffff,
   roughness:0.8
  })
 
  tubeMat.depthWrite=false
 
  this.ropeLine=new THREE.Mesh(tubeGeo,tubeMat)
 
  this.scene.add(this.ropeLine)
 
 }
 
 updateMouse(event:MouseEvent){
 
  const rect=this.container.nativeElement.getBoundingClientRect()
 
  this.mouseX=(event.clientX-rect.left)/rect.width-0.5
  this.mouseY=(event.clientY-rect.top)/rect.height
 
 }
 
 startDrag(event:MouseEvent){
  this.isDragging=true
  this.updateMouse(event)
 }
 
 stopDrag(){
  this.isDragging=false
 }
 
 onMouseMove(event:MouseEvent){
 
  this.updateMouse(event)
 
  if(this.isDragging){
 
   const targetX=this.mouseX*2
   const targetY=1.5-this.mouseY*3
 
   const p=this.points[this.points.length-1]
 
   p.x+=(targetX-p.x)*0.35
   p.y+=(targetY-p.y)*0.35
 
  }
 
 }
 
 updatePhysics(){
 
  const friction=0.999
 
  for(let i=1;i<this.points.length;i++){
 
   const p=this.points[i]
 
   const vx=(p.x-p.oldx)*friction
   const vy=(p.y-p.oldy)*friction
 
   p.oldx=p.x
   p.oldy=p.y
 
   p.x+=vx
   p.y+=vy-0.002
 
  }
 
 }
 
 solveConstraints(){
 
  const stiffness=0.75
 
  this.points[0].x = 0
  this.points[0].y = 2.4
 
  for(let k=0;k<3;k++){
 
   for(let i=0;i<this.points.length-1;i++){
 
    const p1=this.points[i]
    const p2=this.points[i+1]
 
    const dx=p2.x-p1.x
    const dy=p2.y-p1.y
 
    const dist=Math.sqrt(dx*dx+dy*dy)||0.0001
 
    const diff=(dist-this.segmentLength)/dist
 
    const offx=dx*0.5*diff*stiffness
    const offy=dy*0.5*diff*stiffness
 
    if(i!=0){
     p1.x+=offx
     p1.y+=offy
    }
 
    p2.x-=offx
    p2.y-=offy
 
   }
 
  }
 
 }
 
 updateRopeMesh(){
 
  const ropePoints=this.points.map(
  p=>new THREE.Vector3(p.x,p.y,0)
  )
 
  const curve=new THREE.CatmullRomCurve3(ropePoints)
 
  const newGeo=new THREE.TubeGeometry(
  curve,
  40,
  0.02,
  8,
  false
  )
 
  this.ropeLine.geometry.dispose()
 
  this.ropeLine.geometry=newGeo
 
 }
 
 updateCard(){
 
  const last=this.points[this.points.length-1]
  const prev=this.points[this.points.length-2]
 
  const ropeSmooth=0.2
 
  this.smoothedRopeX+=(last.x-this.smoothedRopeX)*ropeSmooth
  this.smoothedRopeY+=(last.y-this.smoothedRopeY)*ropeSmooth
 
  const followSpeed=0.1
 
  this.cardAnchorX+=(this.smoothedRopeX-this.cardAnchorX)*followSpeed
  this.cardAnchorY+=(this.smoothedRopeY-this.cardAnchorY)*followSpeed
 
  const cardHeight=3.4
  const hingeOffset = cardHeight * 0.35
 
  this.cardGroup.position.set(
    last.x,
    last.y,
    0.1
  )
 
  let ropeAngle=Math.atan2(
  last.x-prev.x,
  last.y-prev.y
  )
 
  ropeAngle*=0.001
 
  const stiffness = 0.08
  const damping = 0.90
  
  const force = (ropeAngle - this.cardAngle) * stiffness
  
  this.cardVelocity += force
  this.cardVelocity *= damping
  
  this.cardAngle += this.cardVelocity
 
this.cardGroup.rotation.z = -this.cardAngle
this.cardGroup.rotation.x = 0.06
 
 }
 
 animate=()=>{
 
  requestAnimationFrame(this.animate)
 
  const idle=Math.sin(this.clock.getElapsedTime())*0.005
  this.points[1].x+=idle
 
  this.updatePhysics()
  this.solveConstraints()
  this.updateRopeMesh()
  this.updateCard()
 
  this.renderer.render(this.scene,this.camera)
 
 }
 
 }