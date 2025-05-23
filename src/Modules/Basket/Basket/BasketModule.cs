﻿using Basket.Data.Repository;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared.Data;
using Shared.Data.Interceptors;

namespace Basket
{
    public static class BasketModule
    {
        public static IServiceCollection AddBasketModule(this IServiceCollection services,
            IConfiguration configuration)
        {
            // 2. Application Use Case services
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.Decorate<IBasketRepository, CachedBasketRepository>();

            var connectionString = configuration.GetConnectionString("Database");

            services.AddScoped<ISaveChangesInterceptor, AuditableEntityInterceptor>();
            services.AddScoped<ISaveChangesInterceptor, DispatchDomainEventsInterceptor>();

            services.AddDbContext<BasketDbContext>((sp, options) =>
            {
                options.AddInterceptors(sp.GetServices<ISaveChangesInterceptor>());
                options.UseNpgsql(connectionString);
            });
            return services;
        }

        public static IApplicationBuilder UseBasketModule(this IApplicationBuilder app)
        {
            app.UseMigration<BasketDbContext>();
            return app;
        }
    }
}
