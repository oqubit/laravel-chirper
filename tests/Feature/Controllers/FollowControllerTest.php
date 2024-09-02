<?php

namespace Tests\Feature\Controllers;

use App\Events\UserFollowed;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class FollowControllerTest extends TestCase
{
    public function test_users_can_follow_each_other(): void
    {
        $user = User::factory()->create();
        $following = User::factory()->create();
        $response = $this->actingAs($user)->post(route('follow.store'), ['id' => $following->id]);
        $response->assertRedirect();
        $this->assertContains($following->id, $user->follows->pluck('id'));
    }

    public function test_user_followed_event_got_dispatched(): void
    {
        Event::fake();
        $user = User::factory()->create();
        $following = User::factory()->create();
        $this->actingAs($user)->post(route('follow.store'), ['id' => $following->id]);
        Event::assertDispatched(function (UserFollowed $event) use ($user) {
            return $event->follower->id === $user->id;
        });
    }

    public function test_user_must_be_logged_in_to_follow(): void
    {
        $following = User::factory()->create();
        $response = $this->post(route('follow.store'), ['id' => $following->id]);
        $response->assertRedirect(route('login'));
    }

    public function test_user_must_be_verified_to_follow(): void
    {
        $user = User::factory()->unverified()->create();
        $following = User::factory()->create();
        $response = $this->actingAs($user)->post(route('follow.store'), ['id' => $following->id]);
        $response->assertRedirect(route('verification.notice'));
    }

    public function test_id_field_is_required(): void
    {
        $response = $this
            ->actingAs(User::factory()->make())
            ->post(route('follow.store'));
        $response->assertSessionHasErrors([
            'id' => 'The id field is required.'
        ]);
    }

    public function test_id_field_must_be_a_number(): void
    {
        $response = $this
            ->actingAs(User::factory()->make())
            ->post(route('follow.store'), ['id' => 'o']);
        $response->assertSessionHasErrors([
            'id' => 'The id field must be an integer.',
            'id' => 'The id field must be a number.'
        ]);
    }

    public function test_id_must_differ_from_the_requesting_user_id(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post(route('follow.store'), ['id' => $user->id]);
        $response->assertSessionHasErrors([
            'id' => 'The selected id is invalid.'
        ]);
    }

    public function test_id_must_belong_to_an_existing_user(): void
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->post(route('follow.store'), ['id' => 99999]);
        $response->assertSessionHasErrors([
            'id' => 'The selected id is invalid.'
        ]);
    }

    public function test_users_can_unfollow_each_other(): void
    {
        $user = User::factory()->create();
        $following = User::factory()->create();
        $response = $this->actingAs($user)->delete(route("follow.destroy", $following->id));
        $response->assertRedirect();
        $this->assertNotContains($following->id, $user->follows->pluck('id'));
    }

    public function test_user_must_be_logged_in_to_unfollow(): void
    {
        $response = $this->delete(route('follow.destroy', 2));
        $response->assertRedirect(route('login'));
    }

    public function test_user_must_be_verified_to_unfollow(): void
    {
        $user = User::factory()->unverified()->create();
        $response = $this->actingAs($user)->delete(route('follow.destroy', 2));
        $response->assertRedirect(route('verification.notice'));
    }
}
