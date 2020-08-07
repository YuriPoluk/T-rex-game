export interface CollisionBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const CollisionBoxes: { [key: string]: CollisionBox[] } = {
    'cactus_0': [
        {
            x: 0,
            y: 17,
            width: 4,
            height: 17
        },
        {
            x: 7,
            y: 3,
            width: 5,
            height: 45
        },
        {
            x: 15,
            y: 8,
            width: 3,
            height: 30
        },
        {
            x: 20,
            y: 20,
            width: 3,
            height: 28
        },
        {
            x: 27,
            y: 7,
            width: 5,
            height: 30
        },
        {
            x: 35,
            y: 1,
            width: 7,
            height: 47
        },
        {
            x: 45,
            y: 12,
            width: 5,
            height: 29
        }
    ],
    'cactus_1': [
        {
            x: 0,
            y: 9,
            width: 4,
            height: 25
        },
        {
            x: 5,
            y: 1,
            width: 5,
            height: 33
        },
        {
            x: 13,
            y: 5,
            width: 3,
            height: 28
        }
    ],
    'cactus_2': [
        {
            x: 1,
            y: 4,
            width: 3,
            height: 20
        },
        {
            x: 6,
            y: 1,
            width: 5,
            height: 34
        },
        {
            x: 13,
            y: 8,
            width: 3,
            height: 18
        }
    ],
    'cactus_3': [
        {
            x: 1,
            y: 13,
            width: 5,
            height: 19
        },
        {
            x: 9,
            y: 1,
            width: 7,
            height: 46
        },
        {
            x: 19,
            y: 11,
            width: 5,
            height: 20
        }
    ],
    'cactus_4': [
        {
            x: 1,
            y: 6,
            width: 5,
            height: 20
        },
        {
            x: 9,
            y: 1,
            width: 7,
            height: 46
        },
        {
            x: 19,
            y: 11,
            width: 5,
            height: 20
        }
    ],
    'dino_run': [
        {
            x: 3,
            y: 17,
            width: 5,
            height: 9
        },
        {
            x: 14,
            y: 17,
            width: 17,
            height: 28
        },
        {
            x: 24,
            y: 3,
            width: 17,
            height: 14
        },
        {
            x: 31,
            y: 17,
            width: 3,
            height: 5
        }
    ],
    'dino_crouch': [
        {
            x: 0,
            y: 0,
            width: 59,
            height: 30
        }
    ]

};