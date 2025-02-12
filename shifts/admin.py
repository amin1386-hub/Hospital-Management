from django.contrib import admin

from shifts.models import Doctor,Section,SameGroupRule

# Register your models here.

admin.site.register(Doctor)
admin.site.register(Section)
admin.site.register(SameGroupRule)
