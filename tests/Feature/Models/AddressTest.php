<?php

test('example', function () {
    $data = \App\Models\Address::factory()->create();
    $this->assertInstanceOf(\App\Models\Address::class, $data);
});
