import Vue from 'vue';
import View from './ViewImage.vue';

const MessageDialog = Vue.extend(View);
let md;
const InitInstance = function(url, type) {
    if(md) {
        md.picUrl = url;
        md.visible = true;
        md.type= type;
        return false;
    }
    md = new MessageDialog({
        el: document.createElement('div')
    })
    md.picUrl = url;
    md.type= type;
    document.body.appendChild(md.$el);
    Vue.nextTick(() => {
        md.visible = true;
    });
}

const view = function(url, type) {
    InitInstance(url, type);
}

export default view;