//Vue.prototype.$http = axios;

const User = {
	props:['id'],
	template: '<div>User {{ id }},{{ $route.query }},{{ $route.hash }}</div>',
	watch: {
		'$route' (to, from) {
		}
	}
}

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
	//mode: 'history',
	routes:[
		//{ path: '/foo', component: {template:'<div>{{$route.query}}</div>'} },
		//{ path: '/bar', component: Bar },
		{ path: '/', components: {default:{template: '<div>index</div>'}},name:"xx.xx.xx",props:true},
		{ path: '/user/:id', components: {default:User},name:"user"},
		{ path: '/404', components: {default:{template: '<div>404</div>'}},name:"404"},
	], // (缩写) 相当于 routes: routes
	scrollBehavior:(to, from, savedPosition) => {
  		if (savedPosition) {
			return savedPosition
		} else {
			return { x: 0, y: 0 }
		}
   }
});

router.beforeEach((to, from, next) => {
	if(app){
		app.$Loading.start()
	}
	
	if(router.getMatchedComponents(to.path) == 0 && to.path != "/404"){
	
		var u = to.path;
		u = "http://sdk.chuleg.com/static/" + u + ".js";
		
		jsonp2(u,{},"callback_",function(data){
			
			if(data === null || data == ""){
				next('/404');
			}else{
				router.addRoutes([
					{ 
						name: encodeURIComponent(to.path),
						path: to.path,
						components: {
							default:{template:'<div>' + data +' 123{{$route.query}}</div>'}
						}
						//{ path: to.path, component: {template:"this is bar , <i-button @click='console.log(this.app.count++)'>按钮{{$router.app.count}} </i-button>"} }
					}
				]);
				// 添加路由显示页面
				app.common.view.s[encodeURIComponent(to.path)]={};
				next(to.fullPath);
			}
		});
	
	}else{
		next();
	}
	if(app){
		app.$Loading.finish()
	}
  
  //
  
});
router.beforeResolve((to, from, next) => {
	next();
});

var menus = [
				{
					id:2,
					title:"系统管理",
					path:"/system",
					icon:"ios-apps",
					children:[
						{
							id:4,
							title:"用户管理",
							path:"/system/user",
							//icon:"ios-apps",
							children:[
								{
									id:5,
									title:"Foo",
									path:"/foo",
									
								},
								{
									id:6,
									title:"Bar",
									path:"/bar",
									
								},
								{
									id:7,
									title:"user",
									path:"/user/66?a=1&b=2#!123456"
								}
							]
						},
						{
							id:9,
							title:"用户管理",
							path:"/system/user",
							//icon:"ios-apps",
							children:[
								{
									id:10,
									title:"Foo",
									path:"/foo",
									
								},
								{
									id:11,
									title:"Bar",
									path:"/bar",
									
								},
								{
									id:12,
									title:"user",
									path:"/user/66?a=1&b=2#!123456"
								}
							]
						},
						{
							id:8,
							title:"FOO管理",
							path:"/foo"
							//icon:"ios-apps",
						}
					]
				},
				{
					id:3,
					title:"业务管理",
					path:"/buis",
					children:[
						{
							id:4,
							title:"用xxx",
							path:"/system/user",
							
						}
					]
				}
			];

 
var app = new Vue({
  el: '#app',
  router : router,
  data: {
	common:{
		// 菜单
		menu:{
			// 数据
			datas:menus,
			// 横菜单激活
			horizontal_active:'2',
			// 展开的子菜单
			opens:['2-4'],// ['2-4']
			// 活动的菜单
			active:"",// 2-4-5
			// 是否收缩侧边菜单
			isCollapsed:false
		},
		view:{
			show:"default",
			s:{
				"default":{},
				"test":{}
			}
			
		}
	},
	count:0
	},
	methods:{
		// 展开菜单 选中之后触发
		menu_select:function(name){
			if(name && name.indexOf("-") != -1){
				this.common.menu.opens=[name.substring(0,name.lastIndexOf("-"))]
			}
			this.common.menu.active = name;
		},
		// 收缩菜单 选中之后触发
		dropdown_menu_goto:function(path){
			var arr = path.split("@#$");
			this.$router.push(arr[0]);
			this.common.menu.active=arr[1];
			if(arr[1].indexOf("-") != -1){
				this.common.menu.opens=[arr[1].substring(0,arr[1].lastIndexOf("-"))]
			}
		},
		horizontal_select:function(name){
			this.common.menu.horizontal_active = name;
		},
		collapsedSider () {
			this.$refs.side_l.toggleCollapse();
		}
	},
	computed: {
		rotateLogo () {
			return [
				'layout-logo',
				this.common.menu.isCollapsed ? 'layout-logo-collapsed' : ''
			];
		},
		rotateIcon () {
			return [
				'layout-icon',
				'menu-icon',
				this.common.menu.isCollapsed ? 'rotate-icon' : ''
			];
		},
		menuitemClasses () {
			return [
				'menu-item',
				this.common.menu.isCollapsed ? 'collapsed-menu' : ''
			]
		}
	},
	watch:{
		
	},
	created:function(){
		
	},
	mounted:function(){
		
	}
});
app.$Loading.config({
    color: '#5cb85c',
    failedColor: '#f0ad4e',
    height: 3
});




function jsonp(url,params,callback,success){

	window.Vue.http.jsonp(url, {
		params:params,
		jsonpCallback : callback
	}).then(function(res) {
		success(res);
		
	}, function(res) {
		
	});

}

function jsonp2(url,params,callback,success){
	var js = document.createElement("script");
	var id = parseInt(Math.random() * 1000000) + "_" + parseInt(Math.random() * 1000000);
	js.id = id;
	js.src = url;
	js.onerror = function(e){
		success(null);
	}
	window[callback] = function(data){
		success(data);
	}
	document.body.appendChild(js);
}




























