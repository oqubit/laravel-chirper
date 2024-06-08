<?php

namespace Tests\Feature\Events;

use App\Events\ChirpCreated;
use App\Models\User;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class ChirpCreatedTest extends TestCase
{
    public function test_chirp_create_event_dispatched_successfully(): void
    {
        Event::fake();
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->post(route('chirps.store'), ['message' => 'Dog says meow!']);
        Event::assertDispatched(ChirpCreated::class);
    }
}
