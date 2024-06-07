<?php

namespace Tests\Feature\Controllers;

use App\Models\Chirp;
use App\Models\User;
use Tests\TestCase;

class ChirpControllerTest extends TestCase
{
    public function test_user_is_redirected_from_index_if_not_logged_in(): void
    {
        $response = $this->get(route('chirps.index'));
        $response->assertRedirect(route('login'));
    }

    public function test_index_returns_200(): void
    {
        $user = User::factory()->makeOne();
        $this->actingAs($user);
        $response = $this->get(route('chirps.index'));
        $response->assertOk();
    }

    public function test_can_create_new_chirp(): void
    {
        $this->assertDatabaseEmpty('chirps');
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post(route('chirps.store'), ['message' => 'Hello there!']);
        $this->assertDatabaseHas('chirps', [
            'message' => 'Hello there!',
        ]);
        $response->assertRedirect(route('chirps.index'));
    }

    public function test_new_chirp_must_have_a_message(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post(route('chirps.store'), []);
        $response->assertSessionHasErrors([
            'message' => 'The message field is required.'
        ]);
    }

    public function test_new_chirp_message_must_be_a_string(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post(route('chirps.store'), ['message' => 123]);
        $response->assertSessionHasErrors([
            'message' => 'The message field must be a string.'
        ]);
    }

    public function test_new_chirp_message_must_be_less_than_255_chars(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $response = $this->post(route('chirps.store'), ['message' => str_repeat('a', 256)]);
        $response->assertSessionHasErrors([
            'message' => 'The message field must not be greater than 255 characters.'
        ]);
    }

    public function test_chirp_message_can_be_edited(): void
    {
        $chirp = Chirp::factory()->create();
        $this->actingAs($chirp->user);
        $response = $this->patch(route('chirps.update', $chirp), ['message' => 'Hello, this is an edited message.']);
        $this->assertDatabaseHas('chirps', [
            'message' => 'Hello, this is an edited message.'
        ]);
        $response->assertRedirect(route('chirps.index'));
    }

    public function test_edited_chirp_must_have_a_message(): void
    {
        $chirp = Chirp::factory()->create();
        $this->actingAs($chirp->user);
        $response = $this->patch(route('chirps.update', $chirp->id), []);
        $response->assertSessionHasErrors([
            'message' => 'The message field is required.'
        ]);
    }

    public function test_edited_chirp_message_must_be_a_string(): void
    {
        $chirp = Chirp::factory()->create();
        $this->actingAs($chirp->user);
        $response = $this->patch(route('chirps.update', $chirp->id), ['message' => 123]);
        $response->assertSessionHasErrors([
            'message' => 'The message field must be a string.'
        ]);
    }

    public function test_edited_chirp_message_must_be_less_than_255_chars(): void
    {
        $chirp = Chirp::factory()->create();
        $this->actingAs($chirp->user);
        $response = $this->patch(route('chirps.update', $chirp->id), ['message' => str_repeat('a', 256)]);
        $response->assertSessionHasErrors([
            'message' => 'The message field must not be greater than 255 characters.'
        ]);
    }

    public function test_chirp_cannot_be_updated_by_a_non_owner(): void
    {
        $chirp = Chirp::factory()->create();
        $wrongUser = User::factory()->create();
        $this->actingAs($wrongUser);
        $response = $this->patch(route('chirps.update', $chirp), ['message' => 'Hello >:D']);
        $response->assertForbidden();
    }

    public function test_chirp_can_be_deleted(): void
    {
        $chirp = Chirp::factory()->create();
        $this->assertDatabaseCount('Chirps', 1);
        $this->actingAs($chirp->user);
        $response = $this->delete(route('chirps.destroy', $chirp));
        $response->assertRedirect(route('chirps.index'));
        $this->assertDatabaseEmpty('chirps');
    }

    public function test_chirp_cannot_be_deleted_by_a_non_owner(): void
    {
        $chirp = Chirp::factory()->create();
        $this->assertDatabaseCount('Chirps', 1);
        $wrongUser = User::factory()->create();
        $this->actingAs($wrongUser);
        $response = $this->delete(route('chirps.destroy', $chirp));
        $response->assertForbidden();
        $this->assertDatabaseCount('Chirps', 1);
    }
}
