﻿using Catalog.Wishlists.DTOs;
using Catalog.Wishlists.Models;
using Catalog.Wishlists.Repositories;

namespace Catalog.Wishlists.Features.CreateWishlist;

public record CreateWishlistCommand(WishlistDTO Wishlist)
    : ICommand<CreateWishlistResult>;

public record CreateWishlistResult(Guid Id);

public class CreateWishlistCommandValidator : AbstractValidator<CreateWishlistCommand>
{
    public CreateWishlistCommandValidator()
    {
        RuleFor(x => x.Wishlist.CustomerId).NotEmpty().WithMessage("CustomerId is required");
    }
}

internal class CreateWishlistHandler(IWishlistRepository repository)
    : ICommandHandler<CreateWishlistCommand, CreateWishlistResult>
{
    public async Task<CreateWishlistResult> Handle(CreateWishlistCommand command, CancellationToken cancellationToken)
    {
        var wishlist = CreateNewWishlist(command.Wishlist);

        await repository.CreateWishlist(wishlist, cancellationToken);

        return new CreateWishlistResult(wishlist.Id);
    }

    private Wishlist CreateNewWishlist(WishlistDTO wishlistDto)
    {
        // create new wishlist
        var newWishlist = Wishlist.Create(
            Guid.NewGuid(),
            wishlistDto.CustomerId);

        wishlistDto.Items.ForEach(item =>
        {
            newWishlist.AddItem(
                item.ProductId,
                item.PriceWhenAdded,
                item.ProductName);
        });

        return newWishlist;
    }
}

