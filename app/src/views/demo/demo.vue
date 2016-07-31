<style lang="scss">

@import "../../../styles/views/demo/demo.scss";

</style>

<template>

    <ul>
        <li>tttttttttttttttttttt</li>
    </ul>
    <test></test>


</template>

<script>

import { Toast } from 'mint-ui';
// 进行效果上面的覆盖写法
import '../../../styles/module/toast.scss';
import Test from '../../components/demo/test.vue';

export default {
    data: function() {
        return {
            message: 1,
            peoples: [{
                name: "小红",
                age: 20
            }, {
                name: "张三",
                age: 12
            }, {
                name: "三五",
                age: 78
            }, {
                name: "阿文",
                age: 22
            }, {
                name: "李六",
                age: 78
            }, ]
        }
    },
    ready() {
        Toast({
          message: 'Upload Complete',
          position: 'bottom',
          duration: 225000
        });
    },
    components:{
        'test': Test
    }
}

</script>
