<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
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
            'firstname' => $this->firstname,
            'middlename' => $this->middlename,
            'lastname' => $this->lastname,
            'sex' => $this->sex,
            'marital_status' => $this->marital_status,
            'birthdate' => $this->birthdate,
            'address' => $this->address,
            'occupation' => $this->occupation,
            'cellphone_no' => $this->cellphone_no,
            'spouse_name' => $this->spouse_name,
            'spouse_occupation' => $this->spouse_occupation,
            'spouse_cellphone_no' => $this->spouse_cellphone_no,
            'status' => $this->status,
        ];
    }
}
