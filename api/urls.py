from django.conf.urls import url, include
from rest_framework.urlpatterns import format_suffix_patterns
from .views import GetCourseView, ShowCourseView, StoreCourseView, EnrollCourseView, GetCategoriesView, CompleteLectureView, StoreLessonView, StoreLectureView, StoreFilesView, StoreQuestionsView, StoreUserView, GetUserView, MyCoursesView, EditCourseView, UpdateCourseImageView, UpdateCourseInstructorAvatarView, StoreAnswerView, UpdateCorrectAnswerView, CompleteCourseView, SearchCourseView, RemoveCourseView
from rest_framework_jwt.views import obtain_jwt_token


urlpatterns = {
    url(r'^signIn', obtain_jwt_token),
    url(r'^signUp', StoreUserView.as_view(), name='storeUser'),
    url(r'^getUser/$', GetUserView.as_view(), name='getUser'),
    url(r'^getCourses/(?P<category>(\d+))/(?P<count>(\d+))/(?P<page>(\d+))/$', GetCourseView.as_view(), name='getCourse'),
    url(r'^myCourses/(?P<category>(\d+))/(?P<count>(\d+))/(?P<page>(\d+))/$', MyCoursesView.as_view(), name='myCourses'),
    url(r'^searchCourse/(?P<count>(\d+))/(?P<page>(\d+))/$', SearchCourseView.as_view(), name='searchCourse'),
    url(r'^storeCourse', StoreCourseView.as_view(), name='storeCourse'),
    url(r'^editCourse/(?P<id>(\d+))/$', EditCourseView.as_view(), name='editCourse'),
    url(r'^updateCourse/(?P<id>(\d+))/$', StoreCourseView.as_view(), name='updateCourse'),
    url(r'^updateCourseImage/(?P<id>(\d+))/$', UpdateCourseImageView.as_view(), name='updateCourseImage'),
    url(r'^updateCourseInstructorAvatar/(?P<id>(\d+))/$', UpdateCourseInstructorAvatarView.as_view(), name='updateCouseInstructorAvatar'),
    url(r'^deleteCourse/(?P<id>(\d+))/$', RemoveCourseView.as_view(), name='deleteCourse'),
    url(r'^showCourse/(?P<id>(\d+))/$', ShowCourseView.as_view(), name='showCourse'),
    url(r'^enrollCourse/(?P<id>(\d+))/$', EnrollCourseView.as_view(), name='enrollCourse'),
    url(r'^completeLecture/$', CompleteLectureView.as_view(), name='completeLecture'),
    url(r'^completeCourse/$', CompleteCourseView.as_view(), name='completeCourse'),
    url(r'^storeLesson', StoreLessonView.as_view(), name='storeLesson'),
    url(r'^updateLesson/(?P<id>(\d+))/$', StoreLessonView.as_view(), name='updateLesson'),
    url(r'^deleteLesson/(?P<id>(\d+))/$', StoreLessonView.as_view(), name='deleteLesson'),
    url(r'^storeLecture', StoreLectureView.as_view(), name='storeLecture'),
    url(r'^updateLecture/(?P<id>(\d+))/$', StoreLectureView.as_view(), name='updateLecture'),
    url(r'^deleteLecture/(?P<id>(\d+))/$', StoreLectureView.as_view(), name='deleteLecture'),
    url(r'^storeFiles', StoreFilesView.as_view(), name='storeFiles'),
    url(r'^deleteFile/(?P<id>(\d+))/$', StoreFilesView.as_view(), name='deleteFile'),
    url(r'^storeQuestion', StoreQuestionsView.as_view(), name='storeQuestion'),
    url(r'^updateQuestion/(?P<id>(\d+))/$', StoreQuestionsView.as_view(), name='updateQuestion'),
    url(r'^deleteQuestion/(?P<id>(\d+))/$', StoreQuestionsView.as_view(), name='deleteQuestion'),
    url(r'^storeAnswer/$', StoreAnswerView.as_view(), name='storeAnswer'),
    url(r'^updateAnswer/(?P<id>(\d+))/$', StoreAnswerView.as_view(), name='updateAnswer'),
    url(r'^updateCorrectAnswer/(?P<lid>(\d+))/(?P<aid>(\d+))/$', UpdateCorrectAnswerView.as_view(), name='updateCorrectAnswer'),
    url(r'^deleteAnswer/(?P<id>(\d+))/$', StoreAnswerView.as_view(), name='deleteAnswer'),
    url(r'^getCategories/$', GetCategoriesView.as_view(), name='getCategories'),
    url(r'^payments/', include('djstripe.urls', namespace="djstripe")),

}

urlpatterns = format_suffix_patterns(urlpatterns)
