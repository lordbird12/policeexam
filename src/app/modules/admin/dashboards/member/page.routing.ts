import { Route } from '@angular/router';
import { PageComponent } from 'app/modules/admin/dashboards/member/page.component';
import { PageResolver } from 'app/modules/admin/dashboards/member/page.resolvers';

export const projectRoutes: Route[] = [
    {
        path     : '',
        component: PageComponent,
        resolve  : {
            data: PageResolver
        }
    }
];
