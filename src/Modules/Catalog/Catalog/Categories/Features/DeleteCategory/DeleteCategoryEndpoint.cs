﻿using System.Security.Claims;

namespace Catalog.Categories.Features.DeleteCategory
{
    public class DeleteCategoryEndpoint : ICarterModule
    {
        public void AddRoutes(IEndpointRouteBuilder app)
        {
            app.MapDelete("/categories/{id}", async (Guid id, ISender sender, ClaimsPrincipal user) =>
            {
                if (!user.IsInRole("admin"))
                {
                    return Results.Forbid(); 
                }

                var result = await sender.Send(new DeleteCategoryCommand(id));

                var response = new DeleteCategoryResult(result.IsSuccessful);

                return Results.Ok(response);
            })
            .WithName("Delete Category")
            .Produces<DeleteCategoryResult>(StatusCodes.Status200OK)
            .ProducesProblem(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status403Forbidden) 
            .WithSummary("Delete Category")
            .WithDescription("Delete a category by its ID. Accessible only by admin.");
        }
    }
}
