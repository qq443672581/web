Vue.component('nav-tag', {
	props:["color"],
	data: function () {
		return {
		  count: 0
		}
	},
	template: "<div style='width:100%;height:40px;line-height:40px;text-indent:2em;background:pink'>Nav-Tag</div>"
})