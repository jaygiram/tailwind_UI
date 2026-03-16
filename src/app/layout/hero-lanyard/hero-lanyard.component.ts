import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';

import * as THREE from 'three';

@Component({
  selector: 'app-hero-lanyard',
  standalone: true,
  templateUrl: './hero-lanyard.component.html',
  styleUrls: ['./hero-lanyard.component.css']
})
export class HeroLanyardComponent implements AfterViewInit {

  @ViewChild('canvasContainer') container!: ElementRef;

  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer

  card!: THREE.Mesh
  ropeLine!: THREE.Mesh<THREE.TubeGeometry, THREE.MeshStandardMaterial>

  points:any[]=[]
  segments=8
  segmentLength=0.25

  isDragging=false
  mouseX=0
  mouseY=0

  ngAfterViewInit(){
    this.initThree()
    this.initRope()
    this.animate()
  }

  initThree(){

    const width=340
    const height=460

    this.scene=new THREE.Scene()

    this.camera=new THREE.PerspectiveCamera(
      40,width/height,0.1,100
    )

    this.camera.position.z=6

    this.renderer=new THREE.WebGLRenderer({
      alpha:true,
      antialias:true
    })

    this.renderer.setSize(width,height)

    this.container.nativeElement.appendChild(
      this.renderer.domElement
    )

    const light=new THREE.DirectionalLight(0xffffff,1)
    light.position.set(3,3,5)

    const ambient=new THREE.AmbientLight(0xffffff,0.6)

    this.scene.add(light)
    this.scene.add(ambient)

    /* CARD */

    const cardGeo=new THREE.BoxGeometry(2.4,3.4,0.1)

    const texture=new THREE.TextureLoader().load(
      'assets/lanyard/card.png'
    )

    const cardMat=new THREE.MeshStandardMaterial({
      map:texture
    })

    this.card=new THREE.Mesh(cardGeo,cardMat)

    this.card.position.set(0,-0.8,0.1)

    this.scene.add(this.card)

    /* GLARE EFFECT */

    const glareGeo=new THREE.PlaneGeometry(2.3,3.3)

    const glareMat=new THREE.MeshBasicMaterial({
      color:0xffffff,
      transparent:true,
      opacity:0.15,
      blending:THREE.AdditiveBlending
    })

    const glare=new THREE.Mesh(glareGeo,glareMat)

    glare.position.z=0.06

    this.card.add(glare)

  }

  /* ROPE PHYSICS INITIALIZATION */

  initRope(){

    this.points=[]

    for(let i=0;i<=this.segments;i++){

      const y=1.5-(i*this.segmentLength)

      this.points.push({
        x:0,
        y:y,
        oldx:0,
        oldy:y
      })

    }

    const ropePoints=this.points.map(p=>new THREE.Vector3(p.x,p.y,0))

    const curve=new THREE.CatmullRomCurve3(ropePoints)

    const tubeGeo=new THREE.TubeGeometry(
      curve,
      40,
      0.02,
      8,
      false
    )

    const tubeMat=new THREE.MeshStandardMaterial({
      color:0xffffff,
      roughness:0.7
    })

    tubeMat.depthWrite=false

    this.ropeLine=new THREE.Mesh(tubeGeo,tubeMat)

    this.scene.add(this.ropeLine)

  }

  /* MOUSE */

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

  /* PHYSICS */

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

    const stiffness=0.85

    this.points[0].x=0
    this.points[0].y=1.5

    for(let k=0;k<5;k++){

      for(let i=0;i<this.points.length-1;i++){

        const p1=this.points[i]
        const p2=this.points[i+1]

        const dx=p2.x-p1.x
        const dy=p2.y-p1.y

        const dist=Math.sqrt(dx*dx+dy*dy)

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

  /* UPDATE ROPE GEOMETRY */

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

  /* CARD FOLLOW ROPE */

  updateCard(){

    const last=this.points[this.points.length-1]
    const prev=this.points[this.points.length-2]

    this.card.position.set(last.x,last.y,0.1)

    const angle=Math.atan2(
      last.x-prev.x,
      last.y-prev.y
    )

    this.card.rotation.z=-angle

  }

  /* MAIN LOOP */

  animate=()=>{

    requestAnimationFrame(this.animate)

    this.updatePhysics()

    this.solveConstraints()

    this.updateRopeMesh()

    this.updateCard()

    this.renderer.render(this.scene,this.camera)

  }

}