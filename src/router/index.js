import {
    createRouter, createWebHistory,
} from 'vue-router';

function checkAuthenticated(to, from, next) {
    console.log(to.name);
    let _accounts = JSON.parse(localStorage.getItem('accounts'));
    console.log(!_accounts?.[0]?.did);
    if(!_accounts?.[0]?.did) {
        console.log('sss Main');
        next();
    } else {
        console.log('sss');
        // debugger;
        if(to.name !== 'Home') {
            // debugger;
            next('/home');
        } else {
            // debugger;
            next();
        }
    }

}

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Main',
            beforeEnter: checkAuthenticated,
            children: [
                {
                    path: '',
                    name: 'Hello',
                    component: () => import('../components/Hello.vue'),
                },
                {
                    path: '/home',
                    name: 'Home',
                    component: () => import('../components/Home.vue'),
                }
            ]
        },

    ],
});

export default router;
