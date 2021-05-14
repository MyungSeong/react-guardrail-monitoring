import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const Dashboard = React.lazy(() => import('./components/Dashboard/Default'));
const GuardrailSetup = React.lazy(() => import('./components/Guardrail/GuardrailSetup'));

const routes = [
    { path: '/', exact: true, name: 'Dashboard', component: Dashboard },
    { path: '/guardrail/guardrail-setup', exact: true, name: 'Guardrail Setup', component: GuardrailSetup },
];

export default routes;