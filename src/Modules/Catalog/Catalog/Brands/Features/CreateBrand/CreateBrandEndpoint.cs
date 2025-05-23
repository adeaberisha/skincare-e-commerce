﻿using System.Security.Claims;

namespace Catalog.Brands.Features.CreateBrand;

public record CreateBrandRequest
{
    public string Name { get; init; } = string.Empty;
}

public record CreateBrandResponse(Guid Id);

public class CreateBrandEndpoint : ICarterModule
{
    public void AddRoutes(IEndpointRouteBuilder app)
    {
        app.MapPost("/brands", async (
            CreateBrandRequest request,
            ISender sender,
            ClaimsPrincipal user) =>
        {
            if (!user.IsInRole("admin"))
            {
                return Results.Forbid();
            }

            var command = request.Adapt<CreateBrandCommand>();
            var result = await sender.Send(command);
            var response = result.Adapt<CreateBrandResponse>();

            return Results.Created($"/brands/{response.Id}", response);
        })
        .WithName("Create Brand")
        .Produces<CreateBrandResponse>(StatusCodes.Status201Created)
        .ProducesProblem(StatusCodes.Status400BadRequest)
        .Produces(StatusCodes.Status403Forbidden) 
        .WithSummary("Create Brand")
        .WithDescription("Creates a new product Brand. Only accessible by admin.");
    }
}
