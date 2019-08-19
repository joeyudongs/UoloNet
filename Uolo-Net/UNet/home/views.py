from django.views.generic import TemplateView
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from home.forms import HomeForm
from home.models import Post
from lambda_rad import models as lambda_model


class HomeView(TemplateView):
    template_name = 'home/home.html'

    def get(self, request):
        form = HomeForm()
        posts = Post.objects.all().order_by('created')
        users = User.objects.exclude(id=request.user.id)
        institutions = lambda_model.Institution.objects.all().order_by('name')

        args = {'form': form,
                'posts': posts,
                'users':users,
                'institutions': institutions
                }
        return render(request, self.template_name, args)

    def post(self, request):
        form = HomeForm(request.POST)
        print(form)
        if form.is_valid():
            post = form.save(commit=False)
            post.user = request.user
            post.save()

            #text = form.cleaned_data['post']
            form = HomeForm()
            return redirect('home:home')

        args = {'form': form}
        return render(request, self.template_name, args)

#
# def search(request):
#     users = User.objects.exclude(id=request.user.id)
#
#     institutions = lambda_model.Institution.objects.all().order_by('name')
#     # patients = lambda_model.Patient.objects.all()
#
#     args = {'users': users, 'institutions': institutions}
#     return render(request, 'home/search.html', args)