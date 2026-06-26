from django.db import models


class DailyRevenue(models.Model):
    day = models.DateField(unique=True, db_index=True)
    revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)


class DailyOrders(models.Model):
    day = models.DateField(unique=True, db_index=True)
    count = models.PositiveIntegerField(default=0)


class DailyCustomers(models.Model):
    day = models.DateField(unique=True, db_index=True)
    count = models.PositiveIntegerField(default=0)