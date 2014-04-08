//ワールド座標は右手系、カメラ座標は左手系です。
var window = window || {};
(function (window) {
	'use strict';
/****************************************************************************************************
    C3D
****************************************************************************************************/
	//コンストラクタ
	var C3D = function () {
	};
	//C3Dメソッド
	C3D.prototype = {};
/****************************************************************************************************
		C3D.Object
****************************************************************************************************/
    C3D.Object = function (type) {
        //Publicプロパティ
        this.type = type;
    };
    C3D.Object.prototype = {
    };
/****************************************************************************************************
		C3D.Geometry
****************************************************************************************************/
	//コンストラクタ
	C3D.Geometry = function () {
        C3D.Object.apply(this, ["structure"]);
		//Publicプロパティ
		this.position = new C3D.Vector3();
		this.vertices = [];		//C3D.Vector3の配列
		this.lines = [];		//C3D.Lineの配列
		this.faces = [];		//C3D.Faceの配列
		this.postureMatrix = new C3D.Matrix4();
	};
    C3D.Geometry.prototype = Object.create(C3D.Object.prototype);
	//メソッド
	C3D.Geometry.prototype = {
		//positionの変更
		setPosition : function (vector3) {
			this.position = vector3;
			return this;
		},
		//vertexの追加
		addVertex : function (vector3) {
			return this.vertices.push(vector3);
		},
		//lineの追加
		addLine : function (vertices) {
			var l = new C3D.Geometry.Line(vertices);
			return this.lines.push(l);
		},
		//Faceの追加
		addFace : function (vertices) {
			var f = new C3D.Geometry.Face(vertices);
			return this.faces.push(f);
		},
		//x軸回転
		rotateX : function (value) {
			return this.postureMatrix.rotateX(value);
		},
		//y軸回転
		rotateY : function (value) {
			return this.postureMatrix.rotateY(value);
		},
		//z軸回転
		rotateZ : function (value) {
			return this.postureMatrix.rotateZ(value);
		},
		//移動
		transrate : function (x, y, z) {
			return this.postureMatrix.rotate(x, y, z);
		},
		//x軸移動
		transrateX : function (value) {
			return this.postureMatrix.transrateX(value);
		},
		//y軸移動
		transrateY : function (value) {
			
			return this.postureMatrix.transrateY(value);
		},
		//z軸移動
		transrateZ : function (value) {
			return this.postureMatrix.transrateZ(value);
		},
		//x軸拡大
		scaleX : function (value) {
			return this.postureMatrix.scaleX(value);
		},
		//y軸拡大
		scaleY : function (value) {
			return this.postureMatrix.scaleY(value);
		},
		//z軸拡大
		scaleZ : function (value) {
			return this.postureMatrix.scaleZ(value);
		},
		//クォータニオン
		quaternion : function (vector, radian) {
			return this.postureMatrix.quaternion(vector, radian);
		}
	};
/****************************************************************************************************
            C3D.Geometry.Line
****************************************************************************************************/
	//コンストラクタ
	C3D.Geometry.Line = function (vertices) {
		//プロパティ
		this.vertices = vertices;
		this.initCentroid();
	};
	//メソッド
	C3D.Geometry.Line.prototype = {
		//centroidの初期化
		initCentroid : function () {
			var x = (this.vertices[0].x + this.vertices[1].x) / 2,
				y = (this.vertices[0].y + this.vertices[1].y) / 2,
				z = (this.vertices[0].z + this.vertices[1].z) / 2;
			this.centroid = new C3D.Vector3(x, y, z);
			return this.centroid;
		}
	};
/****************************************************************************************************
            C3D.Geometry.Face
****************************************************************************************************/
	//コンストラクタ
	C3D.Geometry.Face = function (vertices) {
		//プロパティ
		this.vertices = vertices;
		this.color = "#888888";
		this.initCentroid();
		this.initNormal();
	};
	//メソッド
	C3D.Geometry.Face.prototype = {
		initCentroid : function () {
			var x = 0,
				y = 0,
				z = 0,
				i,
				vertex;
			for (i = 0; i < this.vertices.length; i = i + 1) {
				vertex = this.vertices[i];
				x += vertex.x;
				y += vertex.y;
				z += vertex.z;
			}
			x /= this.vertices.length;
			y /= this.vertices.length;
			z /= this.vertices.length;
			this.centroid = new C3D.Vector3(x, y, z);
			return this.centroid;
		},
		initNormal : function () {
			var o = this.vertices[0],
				a = this.vertices[1],
				b = this.vertices[this.vertices.length - 1],
				v1 = o.directionTo(a),
				v2 = o.directionTo(b);
			this.normal = C3D.Vector3.ExteriorProduct(v1, v2).normalize();
			return this.normal;
		}
	};
/****************************************************************************************************
        C3D.GeometryTetrahedron
****************************************************************************************************/
    //コンストラクタ
    C3D.GeometryTetrahedron = function (radius, pos) {
        var p = 1,
            scale = radius / Math.sqrt(3),
            v;
        C3D.Geometry.apply(this);
        this.setPosition(pos);
        this.addVertex(new C3D.Vector3(-p, -p, -p).scale(scale));
        this.addVertex(new C3D.Vector3(-p, p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, -p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, p, -p).scale(scale));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[1], v[2]]);
        this.addLine([v[2], v[3]]);
        this.addLine([v[3], v[1]]);
        this.addLine([v[0], v[2]]);
        this.addLine([v[0], v[3]]);
        this.addFace([v[0], v[3], v[2]]);
        this.addFace([v[0], v[2], v[1]]);
        this.addFace([v[0], v[1], v[3]]);
        this.addFace([v[1], v[2], v[3]]);
    };
    //メソッド
	C3D.GeometryTetrahedron.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
        C3D.GeometryHexahedron
****************************************************************************************************/
    //コンストラクタ
    C3D.GeometryHexahedron = function (radius, pos) {
        var p = 1,
            scale = radius / Math.sqrt(3),
            v;
        C3D.Geometry.apply(this);
        this.setPosition(pos);
        this.addVertex(new C3D.Vector3(-p, -p, -p).scale(scale));
        this.addVertex(new C3D.Vector3(-p, -p, p).scale(scale));
        this.addVertex(new C3D.Vector3(-p, p, -p).scale(scale));
        this.addVertex(new C3D.Vector3(-p, p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, -p, -p).scale(scale));
        this.addVertex(new C3D.Vector3(p, -p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, p, -p).scale(scale));
        this.addVertex(new C3D.Vector3(p, p, p).scale(scale));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[2], v[3]]);
        this.addLine([v[4], v[5]]);
        this.addLine([v[6], v[7]]);
        this.addLine([v[0], v[2]]);
        this.addLine([v[2], v[6]]);
        this.addLine([v[6], v[4]]);
        this.addLine([v[4], v[0]]);
        this.addLine([v[1], v[5]]);
        this.addLine([v[5], v[7]]);
        this.addLine([v[7], v[3]]);
        this.addLine([v[3], v[1]]);
        this.addFace([v[0], v[1], v[3], v[2]]);
        this.addFace([v[0], v[2], v[6], v[4]]);
        this.addFace([v[0], v[4], v[5], v[1]]);
        this.addFace([v[7], v[5], v[4], v[6]]);
        this.addFace([v[7], v[3], v[1], v[5]]);
        this.addFace([v[7], v[6], v[2], v[3]]);
    };
    //メソッド
	C3D.GeometryHexahedron.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
        C3D.GeometryOctahedron
****************************************************************************************************/
	//コンストラクタ
	C3D.GeometryOctahedron = function (radius, pos) {
		var p = 1,
            scale = radius,
            v;
		C3D.Geometry.apply(this);
		this.setPosition(pos);
        this.addVertex(new C3D.Vector3(-p, 0, 0).scale(scale));
		this.addVertex(new C3D.Vector3(0, -p, 0).scale(scale));
		this.addVertex(new C3D.Vector3(0, 0, -p).scale(scale));
        this.addVertex(new C3D.Vector3(p, 0, 0).scale(scale));
		this.addVertex(new C3D.Vector3(0, p, 0).scale(scale));
        this.addVertex(new C3D.Vector3(0, 0, p).scale(scale));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[0], v[2]]);
        this.addLine([v[0], v[4]]);
        this.addLine([v[0], v[5]]);
        this.addLine([v[1], v[2]]);
        this.addLine([v[2], v[4]]);
        this.addLine([v[4], v[5]]);
        this.addLine([v[5], v[1]]);
        this.addLine([v[3], v[1]]);
        this.addLine([v[3], v[2]]);
        this.addLine([v[3], v[4]]);
        this.addLine([v[3], v[5]]);
        this.addFace([v[0], v[2], v[1]]);
        this.addFace([v[0], v[4], v[2]]);
        this.addFace([v[0], v[5], v[4]]);
        this.addFace([v[0], v[1], v[5]]);
        this.addFace([v[3], v[1], v[2]]);
        this.addFace([v[3], v[2], v[4]]);
        this.addFace([v[3], v[4], v[5]]);
        this.addFace([v[3], v[5], v[1]]);
	};
	//メソッド
	C3D.GeometryOctahedron.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
        C3D.GeometryDodecahedron
****************************************************************************************************/
	//コンストラクタ
	C3D.GeometryDodecahedron = function (radius, pos) {
		var p = (1 + Math.sqrt(5)) / 2,
            q = Math.pow(p, 2),
            scale = radius / (Math.sqrt(3) * p),
            v;
		C3D.Geometry.apply(this);
		this.setPosition(pos);
        this.addVertex(new C3D.Vector3(0, -1, -q).scale(scale));
		this.addVertex(new C3D.Vector3(0, 1, -q).scale(scale));
		this.addVertex(new C3D.Vector3(0, -1, q).scale(scale));
        this.addVertex(new C3D.Vector3(0, 1, q).scale(scale));
		this.addVertex(new C3D.Vector3(-1, -q, 0).scale(scale));
        this.addVertex(new C3D.Vector3(1, -q, 0).scale(scale));
        this.addVertex(new C3D.Vector3(-1, q, 0).scale(scale));
		this.addVertex(new C3D.Vector3(1, q, 0).scale(scale));
		this.addVertex(new C3D.Vector3(-q, 0, -1).scale(scale));
        this.addVertex(new C3D.Vector3(-q, 0, 1).scale(scale));
		this.addVertex(new C3D.Vector3(q, 0, -1).scale(scale));
        this.addVertex(new C3D.Vector3(q, 0, 1).scale(scale));
        this.addVertex(new C3D.Vector3(-p, -p, -p).scale(scale));
		this.addVertex(new C3D.Vector3(-p, -p, p).scale(scale));
        this.addVertex(new C3D.Vector3(-p, p, -p).scale(scale));
		this.addVertex(new C3D.Vector3(-p, p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, -p, -p).scale(scale));
		this.addVertex(new C3D.Vector3(p, -p, p).scale(scale));
        this.addVertex(new C3D.Vector3(p, p, -p).scale(scale));
		this.addVertex(new C3D.Vector3(p, p, p).scale(scale));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[2], v[3]]);
        this.addLine([v[4], v[5]]);
        this.addLine([v[6], v[7]]);
        this.addLine([v[8], v[9]]);
        this.addLine([v[10], v[11]]);
        this.addLine([v[12], v[0]]);
        this.addLine([v[12], v[4]]);
        this.addLine([v[12], v[8]]);
        this.addLine([v[13], v[2]]);
        this.addLine([v[13], v[4]]);
        this.addLine([v[13], v[9]]);
        this.addLine([v[14], v[1]]);
        this.addLine([v[14], v[6]]);
        this.addLine([v[14], v[8]]);
        this.addLine([v[15], v[3]]);
        this.addLine([v[15], v[6]]);
        this.addLine([v[15], v[9]]);
        this.addLine([v[16], v[0]]);
        this.addLine([v[16], v[5]]);
        this.addLine([v[16], v[10]]);
        this.addLine([v[17], v[2]]);
        this.addLine([v[17], v[5]]);
        this.addLine([v[17], v[11]]);
        this.addLine([v[18], v[1]]);
        this.addLine([v[18], v[7]]);
        this.addLine([v[18], v[10]]);
        this.addLine([v[19], v[3]]);
        this.addLine([v[19], v[7]]);
        this.addLine([v[19], v[11]]);
        this.addFace([v[0], v[1], v[18], v[10], v[16]]);
        this.addFace([v[1], v[0], v[12], v[8], v[14]]);
        this.addFace([v[2], v[3], v[15], v[9], v[13]]);
        this.addFace([v[3], v[2], v[17], v[11], v[19]]);
        this.addFace([v[4], v[5], v[17], v[2], v[13]]);
        this.addFace([v[5], v[4], v[12], v[0], v[16]]);
        this.addFace([v[6], v[7], v[18], v[1], v[14]]);
        this.addFace([v[7], v[6], v[15], v[3], v[19]]);
        this.addFace([v[8], v[9], v[15], v[6], v[14]]);
        this.addFace([v[9], v[8], v[12], v[4], v[13]]);
        this.addFace([v[10], v[11], v[17], v[5], v[16]]);
        this.addFace([v[11], v[10], v[18], v[7], v[19]]);
	};
	//メソッド
	C3D.GeometryDodecahedron.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
        C3D.GeometryIcosahedron
****************************************************************************************************/
    //コンストラクタ
	C3D.GeometryIcosahedron = function (radius, pos) {
		var p = (1 + Math.sqrt(5)) / 2,
            scale = radius / Math.sqrt(Math.sqrt(5) * p),
            v;
		C3D.Geometry.apply(this);
		this.setPosition(pos);
        this.addVertex(new C3D.Vector3(0, -1, -p).scale(scale));
		this.addVertex(new C3D.Vector3(0, 1, -p).scale(scale));
		this.addVertex(new C3D.Vector3(0, -1, p).scale(scale));
        this.addVertex(new C3D.Vector3(0, 1, p).scale(scale));
		this.addVertex(new C3D.Vector3(-p, 0, -1).scale(scale));
        this.addVertex(new C3D.Vector3(-p, 0, 1).scale(scale));
        this.addVertex(new C3D.Vector3(p, 0, -1).scale(scale));
		this.addVertex(new C3D.Vector3(p, 0, 1).scale(scale));
		this.addVertex(new C3D.Vector3(-1, -p, 0).scale(scale));
        this.addVertex(new C3D.Vector3(1, -p, 0).scale(scale));
		this.addVertex(new C3D.Vector3(-1, p, 0).scale(scale));
        this.addVertex(new C3D.Vector3(1, p, 0).scale(scale));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[2], v[3]]);
        this.addLine([v[4], v[5]]);
        this.addLine([v[6], v[7]]);
        this.addLine([v[8], v[9]]);
        this.addLine([v[10], v[11]]);
        this.addLine([v[0], v[4]]);
        this.addLine([v[0], v[6]]);
        this.addLine([v[0], v[8]]);
        this.addLine([v[0], v[9]]);
        this.addLine([v[1], v[4]]);
        this.addLine([v[1], v[6]]);
        this.addLine([v[1], v[10]]);
        this.addLine([v[1], v[11]]);
        this.addLine([v[2], v[5]]);
        this.addLine([v[2], v[7]]);
        this.addLine([v[2], v[8]]);
        this.addLine([v[2], v[9]]);
        this.addLine([v[3], v[5]]);
        this.addLine([v[3], v[7]]);
        this.addLine([v[3], v[10]]);
        this.addLine([v[3], v[11]]);
        this.addLine([v[4], v[8]]);
        this.addLine([v[4], v[10]]);
        this.addLine([v[5], v[8]]);
        this.addLine([v[5], v[10]]);
        this.addLine([v[6], v[9]]);
        this.addLine([v[6], v[11]]);
        this.addLine([v[7], v[9]]);
        this.addLine([v[7], v[11]]);
        this.addFace([v[0], v[1], v[6]]);
        this.addFace([v[1], v[0], v[4]]);
        this.addFace([v[2], v[3], v[5]]);
        this.addFace([v[3], v[2], v[7]]);
        this.addFace([v[4], v[5], v[10]]);
        this.addFace([v[5], v[4], v[8]]);
        this.addFace([v[6], v[7], v[9]]);
        this.addFace([v[7], v[6], v[11]]);
        this.addFace([v[8], v[9], v[2]]);
        this.addFace([v[9], v[8], v[0]]);
        this.addFace([v[10], v[11], v[1]]);
        this.addFace([v[11], v[10], v[3]]);
        this.addFace([v[0], v[6], v[9]]);
        this.addFace([v[0], v[8], v[4]]);
        this.addFace([v[1], v[4], v[10]]);
        this.addFace([v[1], v[11], v[6]]);
        this.addFace([v[2], v[5], v[8]]);
        this.addFace([v[2], v[9], v[7]]);
        this.addFace([v[3], v[7], v[11]]);
        this.addFace([v[3], v[10], v[5]]);
	};
	//メソッド
	C3D.GeometryIcosahedron.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
        C3D.GeometryCube
****************************************************************************************************/
	//コンストラクタ
	C3D.GeometryCube = function (width, depth, height, pos) {
		var half_depth = depth / 2,
			half_width = width / 2,
			half_height = height / 2,
            v;
		this.depth = depth;
		this.width = width;
		this.height = height;
		C3D.Geometry.apply(this);
		this.setPosition(pos);
		this.addVertex(new C3D.Vector3(half_width, half_depth, half_height));
        this.addVertex(new C3D.Vector3(half_width, -half_depth, half_height));
        this.addVertex(new C3D.Vector3(-half_width, -half_depth, half_height));
        this.addVertex(new C3D.Vector3(-half_width, half_depth, half_height));
        this.addVertex(new C3D.Vector3(half_width, half_depth, -half_height));
        this.addVertex(new C3D.Vector3(half_width, -half_depth, -half_height));
        this.addVertex(new C3D.Vector3(-half_width, -half_depth, -half_height));
        this.addVertex(new C3D.Vector3(-half_width, half_depth, -half_height));
        v = this.vertices;
        this.addLine([v[0], v[1]]);
        this.addLine([v[1], v[2]]);
        this.addLine([v[2], v[3]]);
        this.addLine([v[3], v[0]]);
        this.addLine([v[0], v[4]]);
        this.addLine([v[1], v[5]]);
        this.addLine([v[2], v[6]]);
        this.addLine([v[3], v[7]]);
        this.addLine([v[4], v[5]]);
        this.addLine([v[5], v[6]]);
        this.addLine([v[6], v[7]]);
        this.addLine([v[7], v[4]]);
        this.addFace([v[0], v[3], v[2], v[1]]);
        this.addFace([v[2], v[3], v[7], v[6]]);
        this.addFace([v[4], v[5], v[6], v[7]]);
        this.addFace([v[0], v[1], v[5], v[4]]);
        this.addFace([v[0], v[4], v[7], v[3]]);
        this.addFace([v[1], v[2], v[6], v[5]]);
	};
	//メソッド
	C3D.GeometryCube.prototype = Object.create(C3D.Geometry.prototype);
/****************************************************************************************************
		C3D.Scene
****************************************************************************************************/
	//コンストラクタ
	C3D.Scene = function () {
		this.objects = [];
	};
	//メソッド
	C3D.Scene.prototype = {
		add : function (object) {
			return this.objects.push(object);
		},
        remove : function (object) {
            return this.objects.splice(this.objects.indexOf(object), 1);
        }
	};
/****************************************************************************************************
		C3D.Camera
****************************************************************************************************/
	//コンストラクタ
	C3D.Camera = function (angle, aspect, position, lookAt, upperPoint) {
		this.angle = angle || 0;
		this.aspect = aspect || 0;
		this.position = position || new C3D.Vector3(0, 0, 100);
		this.lookAt = lookAt || new C3D.Vector3();
		this.upperPoint = upperPoint || new C3D.Vector3(0, 100, 0);
		this.initVector();
	};
	//メソッド
	C3D.Camera.prototype = {
		setAngle : function (angle) {
			this.angle = angle;
			return this;
		},
		setAspect : function (aspect) {
			this.aspect = aspect;
			return this;
		},
		setPosition : function (position) {
			this.position = position;
			return this;
		},
		setLookAt : function (pos) {
			this.lookAt = pos;
			return this;
		},
		setUpperPoint : function (pos) {
			this.upperPoint = pos;
			return this;
		},
		initVector : function () {
			this.direction = this.position.directionTo(this.lookAt).normalize();
			this.right = C3D.Vector3.ExteriorProduct(this.direction, this.position.directionTo(this.upperPoint)).normalize();
			this.up = C3D.Vector3.ExteriorProduct(this.right, this.direction).normalize();
			return this;
		}
	};
/****************************************************************************************************
		C3D.Renderer
****************************************************************************************************/
	//コンストラクタ
	C3D.Renderer = function () {
		//Publicプロパティ
		this.canvas = window.document.createElement('canvas');
		this.context = this.canvas.getContext('2d');
	};
	//メソッド
	C3D.Renderer.prototype = {
		//Sizeプロパティの設定
		setSize : function (width, height) {
			this.canvas.style.width = width;
			this.canvas.style.height = height;
			this.canvas.width = width;
			this.canvas.height = height;
			this.width = width;
			this.height = height;
			this.half_width = width / 2;
			this.half_height = height / 2;
			return this;
		},
		//sceneの描画
		render : function (scene, camera) {
			var c,
                objects = [],
                obj,
				m_local,
				m_world,
				m_view,
				m,
				faces = [],
                f,
                lines = [],
                l,
                z,
                z_sortList = [],
                list,
                i,
                j;
            function descending_order(arr) {
                arr.sort(function (p, q) {return q[3] - p[3]; });
                return arr;
            }
			this.scene = scene;
			this.camera = camera;
			this.context.clearRect(0, 0, this.width, this.height);
            c = this.camera;
            //ビュー座標変換行列
            c.initVector();
            m_view = new C3D.Matrix4().transrate(-c.position.x, -c.position.y, -c.position.z).tramsformCoordinate(c.right, c.up, c.direction);
            objects = scene.objects;
            //描画順の決定
			for (i = 0; i < objects.length; i = i + 1) {
                //ジオメトリーの指定
                obj = objects[i];
                if (obj.type === "structure") {
                    //ローカル座標変換行列
                    m_local = new C3D.Matrix4(obj.postureMatrix.matrix);
                    //ワールド座標変換行列
                    m_world = new C3D.Matrix4().transrate(obj.position.x, obj.position.y, obj.position.z);
                    //合成行列
                    m = new C3D.Matrix4().productWith(m_local).productWith(m_world).productWith(m_view);
                    //ラインの描画順の決定(z-sort法)
                    lines = obj.lines;
                    //ライン毎のセントロイドのカメラからの距離取得
                    for (j = 0; j < lines.length; j = j + 1) {
                        l = lines[j];
                        z = l.centroid.expandIntoVector4().productWithMatrix(m).contractIntoVector3().norm();
                        z_sortList.push([i, "line", j, z]);
                    }
                    //フェイスの描画順の決定(z-sort法)         
                    faces = obj.faces;
                    //フェイス毎のセントロイドのカメラからの距離取得
                    for (j = 0; j < faces.length; j = j + 1) {
                        f = faces[j];
                        z = f.centroid.expandIntoVector4().productWithMatrix(m).contractIntoVector3().norm();
                        z_sortList.push([i, "face", j, z]);
                    }
                }
            }
            //z_sortを行う。
            z_sortList = descending_order(z_sortList);
            //描画
            for (i = 0; i < z_sortList.length; i = i + 1) {
                list = z_sortList[i];
                obj = objects[list[0]];
                //ローカル座標変換行列
                m_local = new C3D.Matrix4(obj.postureMatrix.matrix);
                //ワールド座標変換行列
                m_world = new C3D.Matrix4().transrate(obj.position.x, obj.position.y, obj.position.z);
                //合成行列
                m = new C3D.Matrix4().productWith(m_local).productWith(m_world).productWith(m_view);
                if (list[1] === "line") {
                    lines = obj.lines;
                    l = lines[list[2]];
                    this.line(l, m);
                } else if (list[1] === "face") {
                    faces = obj.faces;
                    f = faces[list[2]];
                    this.face(f, m);
                }
            }
			return this;
		},
		//面の描画
		face : function (face, matrix) {
			var ct = this.context,
				vertices = face.vertices,
				v,
				pos,
				i;
			ct.beginPath();
			ct.fillStyle = face.color || '#000000';
			for (i = 0; i < vertices.length; i = i + 1) {
				//ビュー座標
				v = vertices[i].expandIntoVector4().productWithMatrix(matrix);
				//スクリーン座標変換
				pos = this.getScreenPosition(v);
				
				if (i === 0) {
					ct.moveTo(pos.x, pos.y);
				} else {
					ct.lineTo(pos.x, pos.y);
				}
			}
			ct.closePath();
			ct.fill();
			return this;
		},
		//線の描画
		line : function (line, matrix) {
            var ct = this.context,
                vertices = line.vertices,
                v,
                pos,
                i;
            ct.beginPath();
            for (i = 0; i < vertices.length; i = i + 1) {
				//ビュー座標
				v = vertices[i].expandIntoVector4().productWithMatrix(matrix);
				//スクリーン座標変換
				pos = this.getScreenPosition(v);
				
				if (i === 0) {
					ct.moveTo(pos.x, pos.y);
				} else {
					ct.lineTo(pos.x, pos.y);
				}
			}
			ct.closePath();
			ct.stroke();
			return this;
		},
		//点の描画
		dot : function (v) {
			this.context.beginPath();
			this.context.arc(v.x, v.y, 1, 0, Math.PI * 2, false);
			this.context.fill();
			return this;
		},
		//スクリーン座標変換
		getScreenPosition : function (v) {
			var tan_angle = Math.tan(this.camera.angle * Math.PI / 180),
				x = (this.half_width * (v.x / v.z)) / (tan_angle * this.camera.aspect) + this.half_width,
				y = -(this.half_height * (v.y / v.z)) / tan_angle + this.half_height;
			return new C3D.Vector2(x, y);
		}
	};
/****************************************************************************************************
		C3D.Vector4
****************************************************************************************************/
	//コンストラクタ
	C3D.Vector4 = function (x, y, z, w) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
		this.w = (w !== undefined) ? w : 1;
	};
	//メソッド
	C3D.Vector4.prototype = {
        //行列との積
		productWithMatrix : function (matrix4) {
			var x,
				y,
				z,
				w;
			x = matrix4.matrix[0][0] * this.x + matrix4.matrix[0][1] * this.y + matrix4.matrix[0][2] * this.z + matrix4.matrix[0][3] * this.w;
			y = matrix4.matrix[1][0] * this.x + matrix4.matrix[1][1] * this.y + matrix4.matrix[1][2] * this.z + matrix4.matrix[1][3] * this.w;
			z = matrix4.matrix[2][0] * this.x + matrix4.matrix[2][1] * this.y + matrix4.matrix[2][2] * this.z + matrix4.matrix[2][3] * this.w;
			w = matrix4.matrix[3][0] * this.x + matrix4.matrix[3][1] * this.y + matrix4.matrix[3][2] * this.z + matrix4.matrix[3][3] * this.w;
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
			return this;
		},
        //C3D.Vector3への変換
        contractIntoVector3 : function () {
            return new C3D.Vector3(this.x, this.y, this.z);
		}
	};
/****************************************************************************************************
		C3D.Vector3
****************************************************************************************************/
	//コンストラクタ
	C3D.Vector3 = function (x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	};
	//メソッド
	C3D.Vector3.prototype = {
		constructor : C3D.Vector3,
		//正規化
		normalize : function () {
			var norm = this.norm();
			this.x = this.x / norm;
			this.y = this.y / norm;
			this.z = this.z / norm;
			return this;
		},
		//thisを原点とする方向ベクトル
		directionTo : function (v) {
			return new C3D.Vector3(v.x - this.x, v.y - this.y, v.z - this.z);
		},
		//絶対値
		norm : function () {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
		},
        //スカラー積
        scale : function (value) {
            this.x = this.x * value;
            this.y = this.y * value;
            this.z = this.z * value;
            return this;
        },
		//C3D.Vector4への拡張
		expandIntoVector4 : function () {
			return new C3D.Vector4(this.x, this.y, this.z, 1);
		}
	};
	//クラスメソッド　内積
	C3D.Vector3.InnerProduct = function (v1, v2) {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	};
	//クラスメソッド　外積
	C3D.Vector3.ExteriorProduct = function (v1, v2) {
		return new C3D.Vector3(v1.y * v2.z - v1.z * v2.y, v1.z * v2.x - v1.x * v2.z, v1.x * v2.y - v1.y * v2.x);
	};
    //クラスメソッド　和
	C3D.Vector3.Sum = function (v1, v2) {
		return new C3D.Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
	};
    //クラスメソッド　差
	C3D.Vector3.Difference = function (v1, v2) {
		return new C3D.Vector3(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	};
/****************************************************************************************************
		C3D.Vector2
****************************************************************************************************/
	//コンストラクタ
	C3D.Vector2 = function (x, y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	//メソッド
	C3D.Vector2.prototype = {
        constructor : C3D.Vector2,
		//正規化
		normalize : function () {
            var norm = this.norm();
			this.x = this.x / norm;
			this.y = this.y / norm;
			return this;
        },
        //絶対値
		norm : function () {
			return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
		},
        //スカラー積
        scale : function (value) {
            this.x = this.x * value;
            this.y = this.y * value;
            return this;
        }
    };
    //クラスメソッド　内積
	C3D.Vector2.InnerProduct = function (v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	};
    //クラスメソッド　和
	C3D.Vector2.Sum = function (v1, v2) {
		return new C3D.Vector2(v1.x + v2.x, v1.y + v2.y);
	};
    //クラスメソッド　差
	C3D.Vector2.Difference = function (v1, v2) {
		return new C3D.Vector2(v1.x - v2.x, v1.y - v2.y);
	};
/****************************************************************************************************
		C3D.Matrix4
****************************************************************************************************/
	//コンストラクタ
	C3D.Matrix4 = function (matrix) {
		this.matrix = matrix || C3D.Matrix4.IdentityMatrix();
	};
	//メソッド
	C3D.Matrix4.prototype = {
		//初期化
		initMatrix : function () {
			this.matrix = C3D.Matrix4.IdentityMatrix();
			return this;
		},
		//x軸回転
		rotateX : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[1, 0, 0, 0], [0, cos, -sin, 0], [0, sin, cos, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//y軸回転
		rotateY : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[cos, 0, sin, 0], [0, 1, 0, 0], [-sin, 0, cos, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//z軸回転
		rotateZ : function (value) {
			var sin = Math.sin(value),
				cos = Math.cos(value),
				m = new C3D.Matrix4([[cos, -sin, 0, 0], [sin, cos, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//移動
		transrate : function (x, y, z) {
			var m = new C3D.Matrix4([[1, 0, 0, x], [0, 1, 0, y], [0, 0, 1, z], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//x軸移動
		transrateX : function (value) {
			return this.transrate(value, 0, 0);
		},
		//y軸移動
		transrateY : function (value) {
			return this.transrate(0, value, 0);
		},
		//z軸移動
		transrateZ : function (value) {
			return this.transrate(0, 0, value);
		},
		//拡大
		scale : function (x, y, z) {
			var m = new C3D.Matrix4([[x, 0, 0, 0], [0, y, 0, 0], [0, 0, z, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//x軸拡大
		scaleX : function (value) {
			return this.scale(value, 1, 1);
		},
		//y軸拡大
		scaleY : function (value) {
			return this.scale(1, value, 1);
		},
		//z軸拡大
		scaleZ : function (value) {
			return this.scale(1, 1, value);
		},
		//クォータニオン
		quaternion : function (vector, radian) {
			var sin = Math.sin(radian),
				q0 = vector.x * sin,
				q1 = vector.y * sin,
				q2 = vector.z * sin,
				q3 = Math.cos(radian),
				q0_q0 = q0 * q0,
				q0_q1 = q0 * q1,
				q0_q2 = q0 * q2,
				q0_q3 = q0 * q3,
				q1_q1 = q1 * q1,
				q1_q2 = q1 * q2,
				q1_q3 = q1 * q3,
				q2_q2 = q2 * q2,
				q2_q3 = q2 * q3,
				q3_q3 = q3 * q3,
				m = new C3D.Matrix4([[q0_q0 - q1_q1 - q2_q2 + q3_q3, 2 * (q0_q1 - q2_q3), 2 * (q0_q2 + q1_q3), 0], [2 * (q0_q1 + q2_q3), -q0_q0 + q1_q1 - q2_q2 + q3_q3, 2 * (q1_q2 - q0_q3), 0], [2 * (q0_q2 - q1_q3), 2 * (q0_q3 + q1_q2), -q0_q0 - q1_q1 + q2_q2 + q3_q3, 0], [0, 0, 0, 1]]);
			this.productWith(m);
			return this;
		},
		//座標変換
		tramsformCoordinate : function (vectorX, vectorY, vectorZ) {
			var m = new C3D.Matrix4([[vectorX.x, vectorY.x, vectorZ.x, 0], [vectorX.y, vectorY.y, vectorZ.y, 0], [vectorX.z, vectorY.z, vectorZ.z, 0], [0, 0, 0, 1]]);
			this.productWith(m.inverse());
			return this;
		},
		//小行列を返す
		submatrix : function (row, column) {
			var m = new C3D.Matrix3(),
				i,
				j,
				k,
				l;
			for (i = 0, k = 0; i < 3; i = i + 1, k = k + 1) {
				if (i === row) {
					k += 1;
				}
				for (j = 0, l = 0; j < 3; j = j + 1, l = l + 1) {
					if (j === column) {
						l += 1;
					}
					m.matrix[i][j] = this.matrix[k][l];
				}
			}
			return m;
		},
		//行列式を返す
		determinant : function () {
			var det = 0,
				i;
			for (i = 0; i < 4; i = i + 1) {
				det += Math.pow(-1, i) * this.matrix[i][0] * this.submatrix(i, 0).determinant();
			}
			return det;
		},
		//転置
		transposition : function () {
			var m = C3D.Matrix4.IdentityMatrix(),
				i,
				j;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					m[i][j] = this.matrix[j][i];
				}
			}
			this.matrix = m;
			return this;
		},
		//逆行列を返す
		inverse : function () {
			var m = new C3D.Matrix4(),
				det = this.determinant(),
				i,
				j;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					m.matrix[i][j] = Math.pow(-1, i + j) * this.submatrix(i, j).determinant() / det;
				}
			}
			m.transposition();
			return m;
		},
		//行列の積
		productWith : function (matrix4) {
			var m = C3D.Matrix4.IdentityMatrix(),
				i,
				j,
				k,
				element;
			for (i = 0; i < 4; i = i + 1) {
				for (j = 0; j < 4; j = j + 1) {
					element = 0;
					for (k = 0; k < 4; k = k + 1) {
						element += matrix4.matrix[i][k] * this.matrix[k][j];
					}
					m[i][j] = element;
				}
			}
			this.matrix = m;
			return this;
		}
	};
	//クラスメソッド 単位行列を返す
	C3D.Matrix4.IdentityMatrix = function () {
		return [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
	};
/****************************************************************************************************
		C3D.Matrix3
****************************************************************************************************/
	//コンストラクタ
	C3D.Matrix3 = function (matrix) {
		this.matrix = matrix || C3D.Matrix3.IdentityMatrix();
	};
	//メソッド
	C3D.Matrix3.prototype = {
		//行列式
		determinant : function () {
			var det = 0,
				m = this.matrix,
				i;
			for (i = 0; i < 3; i = i + 1) {
				det += m[i % 3][0] * m[(i + 1) % 3][1] * m[(i + 2) % 3][2];
			}
			for (i = 0; i < 3; i = i + 1) {
				det -= m[i % 3][2] * m[(i + 1) % 3][1] * m[(i + 2) % 3][0];
			}
			return det;
		}
	};
	//クラスメソッド 単位行列を返す
	C3D.Matrix3.IdentityMatrix = function () {
		return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
	};
/****************************************************************************************************
		C3D.Control
****************************************************************************************************/
    //コンストラクタ
    C3D.Control = function (obj, camera) {
        var date = new Date();
        this.obj = obj;
        this.camera = camera;
        this.time = date.getTime();
        this.mousePos = new C3D.Vector2();
        this.v = new C3D.Vector2();
        this.addEvents();
    };
    //メソッド
	C3D.Control.prototype = {
        //イベントの追加
        addEvents : function () {
            //ハンドラー
            var pointerdown_bridge = (function (self) {
                return function (e) {
                    if (self.obj !== undefined) {
                        self.pointerdown(e);
                    }
                };
            }(this));
            window.addEventListener('mousedown', this, false);
            window.addEventListener('touchstart', this, false);
        },
        pointerdown : function (e) {
            var date = new Date(),
                touch,
                px,
                py;
            if (e.type === 'mousedown') {
                px = e.clientX;
                py = e.clientY;
            } else if (e.type === 'touchstart') {
                touch = e.touches[0];
                px = touch.clientX;
                py = touch.clientY;
            }
            this.mousePos.x = px;
            this.mousePos.y = py;
            this.time = date.getTime();
            window.addEventListener('mousemove', this, false);
            window.addEventListener('mouseup', this, false);
            window.addEventListener('touchmove', this, false);
            window.addEventListener('touchend', this, false);
            window.addEventListener('touchcancel', this, false);
        },
        pointermove : function (e) {
            //ここから
            var date = new Date(),
                dt = (date.getTime() - this.time) / 1000,
                touch,
                px,
                py,
                ix,
                iy,
                impulse;
            if (e.type === 'mousemove') {
                px = e.clientX;
                py = e.clientY;
            } else if (e.type === 'touchmove') {
                touch = e.touches[0];
                px = touch.clientX;
                py = touch.clientY;
            }
            ix = px - this.mousePos.x;
            iy = py - this.mousePos.y;
            impulse = new C3D.Vector2(ix, iy).scale(dt * 2);
            this.v = C3D.Vector2.Sum(this.v, impulse);
            this.mousePos.x = px;
            this.mousePos.y = py;
            this.time = date.getTime();
        },
        pointerup : function (e) {
            window.removeEventListener('mousemove', this);
            window.removeEventListener('touchmove', this);
            window.removeEventListener('mouseup', this);
            window.removeEventListener('touchend', this);
        },
        update : function () {
            var date = new Date(),
                dt = (date.getTime() - this.time) / 1000,
                v_norm = this.v.norm(),
                dv = v_norm - dt * 10,
                v1,
                v2,
                quaternion_v;
            function clone(obj) {
                var F = function () {};
                F.prototype = obj;
                return new F();
            }
            if (dv > 0) {
                this.camera.initVector();
                v1 = clone(this.camera.right);
                v2 = clone(this.camera.up);
                quaternion_v = C3D.Vector3.Sum(v1.scale(this.v.y), v2.scale(this.v.x)).normalize();
                this.obj.quaternion(quaternion_v, v_norm / 25);
                this.v = this.v.scale(dv / v_norm);
            } else {
                this.v.x = 0;
                this.v.y = 0;
            }
            this.time = date.getTime();
        },
        handleEvent : function (e) {
            switch (e.type) {
            case 'mousedown':
            case 'touchstart':
                this.pointerdown(e);
                break;
            case 'mousemove':
            case 'touchmove':
                this.pointermove(e);
                break;
            case 'touchcancel':
            case 'mouseup':
            case 'touchend':
                this.pointerup(e);
                break;
            }
        }
//        rotate : function () {
            
//        }
    };
    window.C3D = C3D;
}(window));


