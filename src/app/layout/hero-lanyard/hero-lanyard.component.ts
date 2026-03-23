import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core'

import * as THREE from 'three'

@Component({
  selector: 'app-hero-lanyard',
  standalone: true,
  templateUrl: './hero-lanyard.component.html',
  styleUrls: ['./hero-lanyard.component.css']
})
export class HeroLanyardComponent implements AfterViewInit {

  @ViewChild('canvasContainer') container!: ElementRef

  scene!: THREE.Scene
  camera!: THREE.PerspectiveCamera
  renderer!: THREE.WebGLRenderer
  lanyardMaterial!: THREE.MeshStandardMaterial
  triangle!: THREE.Mesh
  card!: THREE.Mesh
  cardGroup!: THREE.Group
  ropeLine!: THREE.Mesh
  points: any[] = []
  segments = 12
  segmentLength = 0.25

  isDragging = false
  mouseX = 0
  mouseY = 0
  cardVelocity = 0
  cardAnchorX = 0
  cardAnchorY = 0

  smoothedRopeX = 0
  smoothedRopeY = 0

  cardAngle = 0
  cardTargetAngle = 0

  clock = new THREE.Clock()

  ngAfterViewInit() {
    this.initThree()
    this.initRope()
    this.animate()
  }

  initThree() {

    const width = this.container.nativeElement.clientWidth
    const height = this.container.nativeElement.clientHeight

    this.scene = new THREE.Scene()
    this.scene.position.y = 0

    this.camera = new THREE.PerspectiveCamera(
      40, width / height, 0.1, 100
    )

    this.camera.position.y = -1
    this.camera.position.z = 8

    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    })

    this.renderer.setSize(width, height, false)

    this.container.nativeElement.appendChild(
      this.renderer.domElement
    )

    const light = new THREE.DirectionalLight(0xffffff, 2) // increase intensity
    light.position.set(2, 5, 5)
    this.scene.add(light)

    /* CARD */

    const cardGeo = new THREE.BoxGeometry(2.9, 3.4, 0.04)

    const texture = new THREE.TextureLoader().load(
      'assets/lanyard/card.png'
    )

    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 16
    texture.generateMipmaps = true
    texture.minFilter = THREE.LinearMipmapLinearFilter

    const cardMat = new THREE.MeshPhysicalMaterial({
      map: texture,
      roughness: 0.25,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      reflectivity: 0.6,
      transparent: true
    })

    this.card = new THREE.Mesh(cardGeo, cardMat)

    this.cardGroup = new THREE.Group()
    this.card.rotation.y = Math.PI
    this.cardGroup.add(this.card)

    // move card DOWN inside group so top becomes pivot
    this.card.position.set(0, -0.3, 0)

    this.cardGroup.position.set(0, -1.2, 0.05)

    /* GLARE */

    const glareGeo = new THREE.PlaneGeometry(1.7, 2)

    const glareMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending


    })

    const glare = new THREE.Mesh(glareGeo, glareMat)
    glare.position.z = 0.07

    this.card.add(glare)


    // 🔺 METAL TRIANGLE CONNECTOR

    const triangleShape = new THREE.Shape()

    triangleShape.moveTo(0, -0.3)      // 🔻 bottom tip
    triangleShape.lineTo(-0.3, 0.25)   // left
    triangleShape.lineTo(0.3, 0.25)    // right
    triangleShape.lineTo(0, -0.3)      // close
    const extrudeSettings = {
      depth: 0.02,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2

    }

    const triangleGeo = new THREE.ShapeGeometry(triangleShape)

    const metalMat = new THREE.MeshPhysicalMaterial({
      color: 0xc0c0c0,
      metalness: 1,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.1
    })

    this.triangle = new THREE.Mesh(triangleGeo, metalMat)
    this.triangle.scale.set(0.7, 0.7, 0.7)

    // add to scene
    this.scene.add(this.triangle)
    this.triangle.add(this.cardGroup)
    this.triangle.rotation.z = Math.PI

  }

  initRope() {

    this.points = []

    for (let i = 0; i <= this.segments; i++) {

      const y = 2 - (i * this.segmentLength)

      this.points.push({
        x: 0,
        y: y,
        oldx: 0,
        oldy: y
      })
    }

    // ✅ CREATE FABRIC MATERIAL ONLY ONCE
    const loader = new THREE.TextureLoader()

    const texture = loader.load('assets/lanyard/lanyard-texture.png')
    const normalMap = loader.load('assets/lanyard/lanyard-normal.png')

    texture.colorSpace = THREE.SRGBColorSpace

    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping

    texture.repeat.set(1, 3)
    normalMap.repeat.set(1, 10)

    this.lanyardMaterial = new THREE.MeshPhysicalMaterial({
      map: texture,
      normalMap: normalMap,

      normalScale: new THREE.Vector2(0.35, 0.35),

      roughness: 0.85,
      metalness: 0.05,

      clearcoat: 0.3,
      clearcoatRoughness: 0.6,

      sheen: 1,                     // 🔥 FABRIC MAGIC
      sheenRoughness: 0.8,
      sheenColor: new THREE.Color(0xffffff),

      side: THREE.DoubleSide

    })

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    this.scene.add(ambient)


  }

  updateMouse(event: MouseEvent) {

    const rect = this.container.nativeElement.getBoundingClientRect()

    this.mouseX = (event.clientX - rect.left) / rect.width - 0.5
    this.mouseY = (event.clientY - rect.top) / rect.height

  }

  startDrag(event: MouseEvent) {
    this.isDragging = true
    this.updateMouse(event)
  }

  stopDrag() {
    this.isDragging = false
  }

  onMouseMove(event: MouseEvent) {

    this.updateMouse(event)

    if (this.isDragging) {

      const targetX = this.mouseX * 2
      const targetY = 1.5 - this.mouseY * 3

      const p = this.points[this.points.length - 1]

      p.x += (targetX - p.x) * 0.35
      p.y += (targetY - p.y) * 0.35

    }

  }

  updatePhysics() {

    const friction = 0.999

    for (let i = 1; i < this.points.length; i++) {

      const p = this.points[i]

      const vx = (p.x - p.oldx) * friction
      const vy = (p.y - p.oldy) * friction

      p.oldx = p.x
      p.oldy = p.y

      p.x += vx
      p.y += vy - 0.002

    }

  }

  solveConstraints() {

    const stiffness = 0.75

    this.points[0].x = 0
    this.points[0].y = 3.2

    for (let k = 0; k < 3; k++) {

      for (let i = 0; i < this.points.length - 1; i++) {

        const p1 = this.points[i]
        const p2 = this.points[i + 1]

        const dx = p2.x - p1.x
        const dy = p2.y - p1.y

        const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001

        const diff = (dist - this.segmentLength) / dist

        const offx = dx * 0.5 * diff * stiffness
        const offy = dy * 0.5 * diff * stiffness

        if (i != 0) {
          p1.x += offx
          p1.y += offy
        }

        p2.x -= offx
        p2.y -= offy

      }

    }

  }

  updateRopeMesh() {

    const vertices: number[] = []
    const uvs: number[] = []

    // slightly thinner = more realistic
    const baseWidth = 0.14

    const curve = new THREE.CatmullRomCurve3(
      this.points.map(p => new THREE.Vector3(p.x, p.y, 0)),
      false,
      'catmullrom',
      0.9
    )

    const smoothPoints = curve.getPoints(80)

    for (let i = 0; i < smoothPoints.length; i++) {

      const p = smoothPoints[i]
      const next = smoothPoints[i + 1] || p

      const dx = next.x - p.x
      const dy = next.y - p.y

      const angle = Math.atan2(dy, dx)

      // ✅ VERY SUBTLE natural twist (not animated)
      const twist = Math.sin(i * 0.1) * 0.08

      const normalAngle = angle + Math.PI / 2

      // ✅ slight width variation (feels organic)
      const width = baseWidth * (1 - i * 0.002)

      const offsetX = Math.cos(normalAngle + twist) * width
      const offsetY = Math.sin(normalAngle + twist) * width

      // ✅ NO fake depth (keep flat, let lighting do work)
      vertices.push(
        p.x - offsetX, p.y - offsetY, 0,
        p.x + offsetX, p.y + offsetY, 0
      )

      const t = i / (smoothPoints.length - 1)
      uvs.push(0, t)
      uvs.push(1, t)
    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3)
    )

    geometry.setAttribute(
      'uv',
      new THREE.Float32BufferAttribute(uvs, 2)
    )

    const indices: number[] = []

    for (let i = 0; i < smoothPoints.length - 1; i++) {
      const base = i * 2

      indices.push(
        base, base + 1, base + 2,
        base + 1, base + 3, base + 2
      )
    }

    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    if (!this.ropeLine) {

      this.ropeLine = new THREE.Mesh(geometry, this.lanyardMaterial)
      this.scene.add(this.ropeLine)

    } else {

      this.ropeLine.geometry.dispose()
      this.ropeLine.geometry = geometry

    }
  }


  animate = () => {

    requestAnimationFrame(this.animate)

    const idle = Math.sin(this.clock.getElapsedTime()) * 0.005
    this.points[1].x += idle

    this.updatePhysics()
    this.solveConstraints()
    this.updateRopeMesh()
    this.updateCard()

    this.renderer.render(this.scene, this.camera)


  }
  updateCard() {

    const last = this.points[this.points.length - 1]
    const prev = this.points[this.points.length - 2]

    // 🔺 TRIANGLE (keep as is)
    // 🔺 TRIANGLE (same)
    this.triangle.position.set(last.x, last.y, 0.1)

    const ropeAngle = Math.atan2(
      last.x - prev.x,
      last.y - prev.y
    )

    // smooth follow (not direct copy)
    const targetTriangleAngle = ropeAngle * 0.01

    this.triangle.rotation.z += (targetTriangleAngle - this.triangle.rotation.z) * 0.01

    // 🪪 CARD SWING (FIXED)

    // reduce rope influence heavily
    const targetAngle = THREE.MathUtils.clamp(ropeAngle * 0.25, -0.35, 0.35)

    // smoother + heavier feel
    const stiffness = 0.035
    const damping = 0.94

    const force = (targetAngle - this.cardAngle) * stiffness

    this.cardVelocity += force
    this.cardVelocity *= damping

    this.cardAngle += this.cardVelocity

    // apply rotation
    // keep physics but reduce impact
    this.cardGroup.rotation.z = -this.cardAngle * 0.15
    this.cardGroup.rotation.x = 0.02
  }
}
