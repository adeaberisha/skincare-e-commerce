﻿using Catalog.Contracts.Review.DTOs;

namespace Catalog.Products.Features.GetProductReviews.GetAllReviews
{
    internal class GetProductReviewsHandler : IRequestHandler<GetProductReviewsQuery, List<ReviewDTO>>
    {
        private readonly IProductReviewRepository _repository;

        public GetProductReviewsHandler(IProductReviewRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ReviewDTO>> Handle(GetProductReviewsQuery request, CancellationToken cancellationToken)
        {
            var reviews = await _repository.GetReviewsByProductId(request.ProductId, cancellationToken);

            if (reviews is null || !reviews.Any())
            {
                return new List<ReviewDTO>();
            }

            return reviews.Select(r => new ReviewDTO
            {
                Id = r.Id,
                ProductId = r.ProductId,
                ReviewText = r.ReviewText,
                Rating = r.Rating,
                ReviewerUserName = r.ReviewerUserName,
                ReviewerUserId = r.ReviewerUserId,
                CreatedAt = r.CreatedAt
            }).ToList();


        }
    }
}
