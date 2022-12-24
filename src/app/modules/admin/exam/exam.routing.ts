import { Route } from '@angular/router';
import { ExamComponent } from './exam.component';

import { ListComponent } from './list/list.component';
import { ExamTodoComponent } from './exam-todo/exam-todo.component';
import { DetailsComponent } from './details/details.component';
// import { AcademyListComponent } from 'app/modules/admin/apps/academy/list/list.component';
// import { AcademyDetailsComponent } from 'app/modules/admin/apps/academy/details/details.component';
// import { AcademyCategoriesResolver, AcademyCourseResolver, AcademyCoursesResolver } from 'app/modules/admin/apps/academy/academy.resolvers';

export const examRoutes: Route[] = [
    {
        path     : '',
        component: ExamComponent,
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
            {
                path     : 'exam-todo',
                pathMatch: 'full',
                component: ExamTodoComponent,
                // resolve  : {
                //     courses: AcademyCoursesResolver
                // }
            },
            {
                path     : 'do-exams/:id',
                component: DetailsComponent,
                // resolve  : {
                //     course: AcademyCourseResolver
                // }
            }
        ]
    }
];
