<?php

namespace Tests\Feature\Notifications;

use App\Models\User;
use App\Notifications\NewFollower;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class NewFollowerTest extends TestCase
{
    public function test_email_contains_valid_content(): void
    {
        Notification::fake();
        $user = User::factory()->create();
        $follower = User::factory()->create();
        
        $user->notify(new NewFollower($follower));

        Notification::assertSentTo($user, NewFollower::class, function ($notification) use ($user, $follower)
        {
            $emailNotification = $notification->toMail($user);
            $this->assertEquals('You have a new follower!', $emailNotification->subject);
            $this->assertEquals("{$follower->name} started following you!", $emailNotification->greeting);
            $this->assertEquals('View their profile', $emailNotification->actionText);
            $this->assertEquals(route('profile.show', $follower->id), $emailNotification->actionUrl);
            
            return true;
        });
    }
}
