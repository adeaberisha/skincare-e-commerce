﻿namespace Ordering.Orders.Features.CreateOrder;

public record CreateOrderCommand(OrderDto Order) : ICommand<CreateOrderResult>;

public record CreateOrderResult(
    Guid Id,
    decimal Subtotal,
    decimal ShippingCost,
    decimal Total
);

