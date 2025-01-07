<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'firstname' => $this->faker->firstName,
            'middlename' => $this->faker->optional()->firstName,
            'lastname' => $this->faker->lastName,
            'sex' => $this->faker->randomElement(['male', 'female']),
            'marital_status' => $this->faker->randomElement(['single', 'married', 'divorced', 'widowed', 'separated']),
            'birthdate' => $this->faker->date(),
            'address' => $this->faker->address,
            'occupation' => $this->faker->jobTitle,
            'cellphone_no' => '9' . $this->faker->numerify('##########'),
            'spouse_name' => $this->faker->name,
            'spouse_occupation' => $this->faker->optional()->jobTitle,
            'spouse_cellphone_no' => '9' . $this->faker->numerify('##########'),
        ];
    }
}
