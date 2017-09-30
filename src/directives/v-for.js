import Vm from '../main.js';

/**
 * v-for directive
 */
export default {
    /**
     * 单独进行编译
     */
    isBlock: true,
    bind () {
        this.parent = this.el.parentNode;
        this.startRef = document.createComment('Start of v-for-directive');
        this.endRef = document.createComment('End of v-for-directive');

        let next = this.el.nextSibling;
        if (next) {
            this.parent.insertBefore(this.startRef, next);
            this.parent.insertBefore(this.endRef, next);
        } else {
            this.parent.appendChild(this.startRef);
            this.parent.appendChild(this.endRef);
        }

        this.parent.removeChild(this.el);
        this.parent.index++;

        this.childElements = [];
        this.childVms = []
    },
    update (arr = []) {
        this.unbind();
        arr.forEach((item, index) => {
            this.createChildInstance(item, index);
        });
    },
    createChildInstance (item, index) {
        let vm, node = this.el.cloneNode(true);

        this.parent.insertBefore(node, this.endRef);
        this.parent.index++;

        /**
         * array item data process
         */
        let data = {
            $index: index
        };
        data[this.subKey] = item;
        vm = new Vm({
            el: node,
            data: data
        }, this.vm);
        vm.__proto__ = this.$vm;

        vm.appendTo(this.vm);
        this.childElements[index] = node;
        this.childVms[index] = vm;
    },
    unbind () {
        if (this.childVms.length != 0) {
            this.childVms.forEach((child) => {
                child.$destroy();
            });
        }
    }
}
