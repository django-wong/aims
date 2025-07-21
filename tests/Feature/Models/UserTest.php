<?php

test('name is stored as first and last name', function () {
    $data = \App\Models\User::factory()->create();

    $data->refresh();

    $this->assertEquals($data->name, $data->first_name . ' ' . $data->last_name);

    $data->name = 'John Doe';

    $res = $data->save();

    $this->assertTrue($res);

    $this->assertEquals('John', $data->first_name);
    $this->assertEquals('Doe', $data->last_name);
});
