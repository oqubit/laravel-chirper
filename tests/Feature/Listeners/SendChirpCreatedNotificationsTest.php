<?php

namespace Tests\Feature\Listeners;

use App\Events\ChirpCreated;
use App\Listeners\SendChirpCreatedNotifications;
use App\Models\Chirp;
use App\Models\User;
use App\Notifications\NewChirp;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class SendChirpCreatedNotificationsTest extends TestCase
{
    public function test_listening_for_chirp_created_event(): void
    {
        Event::fake();
        Event::assertListening(
            ChirpCreated::class,
            SendChirpCreatedNotifications::class
        );
    }

    public function test_notification_is_sent_to_everyone_but_the_chirp_creator(): void
    {
        Notification::fake();
        $users = User::factory(2)->create();
        $chirp = Chirp::factory()->create();
        Notification::assertSentTo([$users], NewChirp::class);
        Notification::assertNotSentTo([$chirp->user], NewChirp::class);
    }
}
