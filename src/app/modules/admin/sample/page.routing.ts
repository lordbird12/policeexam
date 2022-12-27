import { Route } from '@angular/router';
import { PageComponent } from './page.component';

import { ListComponent } from './list/list.component';

// import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
// import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
// import { AcademyCategoriesResolver, AcademyCourseResolver, AcademyCoursesResolver } from 'app/modules/admin/apps/academy/academy.resolvers';

export const pageRoutes: Route[] = [
    {
        path     : '',
        component: PageComponent,
        // resolve  : {
        //     categories: AcademyCategoriesResolver
        // },
        children : [
            {
                path     : 'list',
                pathMatch: 'full',
                component: ListComponent,
                // resolve  : {
                //     courses: AcademyCoursesResolver
                // }
            },
            
        ]
    }
];
