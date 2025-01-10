<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerPlanResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'customer_id' => $this->customer_id,
            'plan_id' => $this->plan_id,
            'customer' => new CustomerResource($this->whenLoaded('customer')),
            'plan' => new PlanResource($this->whenLoaded('plan')),
        ];
    }
}
