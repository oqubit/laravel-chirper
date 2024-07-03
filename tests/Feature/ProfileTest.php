<?php

namespace Tests\Feature;

use App\Models\Chirp;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get('/profile');

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch('/profile', [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/profile');

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete('/profile', [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect('/');

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from('/profile')
            ->delete('/profile', [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect('/profile');

        $this->assertNotNull($user->fresh());
    }

    public function test_public_profile_is_displayed(): void
    {
        $user = User::factory()->create();
        $response = $this
            ->actingAs($user)
            ->get(route('profile.show', $user->id));
        $response->assertOk();
    }

    public function test_users_must_have_verified_emails_to_view_profiles(): void
    {
        $user = User::factory()->unverified()->create();
        $profileUser = User::factory()->create();
        $response = $this
            ->actingAs($user)
            ->get(route('profile.show', $profileUser->id));
        $response->assertRedirect(route('verification.notice'));
    }

    public function test_profile_only_shows_chirps_written_by_the_profile_owner(): void 
    {
        $user = User::factory()->create();
        $profileUser = User::factory()
            ->has(Chirp::factory()->count(5))
            ->create();
        $this->actingAs($user)
            ->get(route('profile.show', $profileUser->id))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Show')
                ->has('user', fn (Assert $page) => $page
                    ->where('id', $profileUser->id)
                    ->where('name', $profileUser->name)
                    ->missing('email')
                    ->missing('password')
                    ->etc()
                )
                ->has('chirps', 5, fn (Assert $page) => $page
                    ->where('id', $profileUser->chirps()->first()->id)
                    ->where('message', $profileUser->chirps()->first()->message)
                    ->etc()
                    ->has('user', fn (Assert $page) => $page
                        ->where('id', $profileUser->id)
                        ->etc()
                    )
                )
            );
    }

    public function test_chirps_belonging_to_other_users_are_not_included(): void 
    {
        // Create the first user
        $user = User::factory()->create();

        // Create another user with the chirps
        // This is to ensure there are chirps in the database 
        // that belong to someone other than the first user
        // (Even though the variable is not used the chirps are created)
        $otherUser = User::factory()
            ->has(Chirp::factory()->count(5))
            ->create();

        // Act as the first user and get the profile page
        $this->actingAs($user)
            ->get(route('profile.show', $user->id))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Profile/Show')
                ->has('user', fn (Assert $page) => $page
                    ->where('id', $user->id)
                    ->where('name', $user->name)
                    ->missing('email')
                    ->missing('password')
                    ->etc()
                )
                ->has('chirps', 0) // Assert that there are no chirps for the first user
            );
    }
}
